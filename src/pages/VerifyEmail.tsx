
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationType, setVerificationType] = useState<'email' | 'sms'>('email');
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { email, phone, firstName, lastName } = location.state || {};

  useEffect(() => {
    if (!email && !phone) {
      navigate('/register');
    }
  }, [email, phone, navigate]);

  const handleVerify = async () => {
    if (code.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the 6-digit verification code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (verificationType === 'email') {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: code,
          type: 'signup'
        });
        if (error) throw error;
      } else {
        // Handle SMS verification here
        const { error } = await supabase.auth.verifyOtp({
          phone,
          token: code,
          type: 'sms'
        });
        if (error) throw error;
      }

      // Create profile after successful verification
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: (await supabase.auth.getUser()).data.user?.id,
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            email: email
          }
        ]);

      if (profileError) throw profileError;

      toast({
        title: "Verification successful",
        description: "You can now log in to your account",
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchVerificationMethod = () => {
    setVerificationType(prev => prev === 'email' ? 'sms' : 'email');
    setCode('');
  };

  const resendVerification = async () => {
    try {
      setIsLoading(true);
      if (verificationType === 'email' && email) {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: email,
        });
        if (error) throw error;
        toast({
          title: "Verification email sent",
          description: "Please check your inbox for the verification code"
        });
      } else if (verificationType === 'sms' && phone) {
        const { error } = await supabase.auth.signUp({
          phone,
          password: Math.random().toString(36).slice(2, 10)  // Random password for SMS verification
        });
        if (error) throw error;
        toast({
          title: "Verification SMS sent",
          description: "Please check your phone for the verification code"
        });
      }
    } catch (error: any) {
      toast({
        title: "Failed to resend verification",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8 text-center">
        <img 
          src="/lovable-uploads/2ebe7ecc-af2a-4e7d-bba7-c42cae035782.png" 
          alt="Oscars Optical Clinic" 
          className="mx-auto mb-6 max-h-24"
        />
      </div>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-crimson-700">
            Verify Your {verificationType === 'email' ? 'Email' : 'Phone'}
          </CardTitle>
          <CardDescription className="text-center">
            Please enter the verification code sent to {verificationType === 'email' ? email : phone}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(value) => setCode(value)}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, i) => (
                    <InputOTPSlot key={i} {...slot} index={i} />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>
          <Button 
            className="w-full bg-crimson-600 hover:bg-crimson-700"
            onClick={handleVerify}
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
          <div className="flex flex-col space-y-2">
            {email && phone && (
              <Button
                variant="link"
                className="text-crimson-600"
                onClick={switchVerificationMethod}
                disabled={isLoading}
              >
                Verify using {verificationType === 'email' ? 'phone number' : 'email'} instead
              </Button>
            )}
            <Button
              variant="ghost"
              className="text-gray-600"
              onClick={resendVerification}
              disabled={isLoading}
            >
              Didn't receive a code? Resend
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
