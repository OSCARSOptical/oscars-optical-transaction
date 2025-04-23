
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User, Image } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: "Admin" | "Doctor" | "Staff" | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  photo_url: string | null;
}

const roles: Array<Profile["role"]> = ["Admin", "Doctor", "Staff"];

export default function ProfileSettings() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarURL, setAvatarURL] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          toast({ title: "Authentication error", description: sessionError.message, variant: "destructive" });
          setLoading(false);
          return;
        }
        
        if (!session?.user) {
          console.log("No authenticated user found");
          toast({ title: "Not authenticated", description: "Please log in to view your profile", variant: "destructive" });
          setLoading(false);
          return;
        }
        
        console.log("Fetching profile for user:", session.user.id);
        
        // Fetch the profile data
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();
          
        if (error) {
          console.error("Profile fetch error:", error);
          toast({ title: "Failed to load profile", description: error.message, variant: "destructive" });
        } else if (data) {
          console.log("Profile data received:", data);
          setProfile(data);
          if (data.photo_url) {
            const url = supabase.storage.from("profile-photos").getPublicUrl(data.photo_url).data.publicUrl;
            console.log("Avatar URL:", url);
            setAvatarURL(url);
          }
        } else {
          console.log("No profile found for this user, creating new profile");
          // Create a new profile if one doesn't exist
          const newProfile = {
            id: session.user.id,
            first_name: null,
            last_name: null,
            role: "Staff" as const,
            phone: null,
            email: session.user.email,
            address: null,
            photo_url: null
          };
          
          setProfile(newProfile);
          
          // Insert the new profile
          const { error: insertError } = await supabase
            .from("profiles")
            .insert([newProfile]);
            
          if (insertError) {
            console.error("Error creating profile:", insertError);
            toast({ title: "Error creating profile", description: insertError.message, variant: "destructive" });
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Unexpected error:", err);
        toast({ title: "Unexpected error", description: "An unexpected error occurred while loading your profile", variant: "destructive" });
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [toast]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setAvatarURL(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUploadPhoto = async () => {
    if (!avatarFile || !profile) return null;
    
    try {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${profile.id}.${fileExt}`;
      const filePath = `${fileName}`;
      
      console.log("Uploading photo to path:", filePath);
      
      const { error } = await supabase.storage
        .from("profile-photos")
        .upload(filePath, avatarFile, { upsert: true });
        
      if (error) {
        console.error("Photo upload error:", error);
        toast({ title: "Photo upload failed", description: error.message, variant: "destructive" });
        return null;
      }
      
      console.log("Photo uploaded successfully");
      return filePath;
    } catch (err) {
      console.error("Unexpected upload error:", err);
      toast({ title: "Upload error", description: "An unexpected error occurred during upload", variant: "destructive" });
      return null;
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) {
      toast({ title: "Error", description: "No profile data to save", variant: "destructive" });
      return;
    }
    
    try {
      setSaving(true);
      console.log("Saving profile:", profile);
      
      let photo_url = profile.photo_url;
      if (avatarFile) {
        const uploadedPath = await handleUploadPhoto();
        if (uploadedPath) {
          photo_url = uploadedPath;
          setAvatarURL(supabase.storage.from("profile-photos").getPublicUrl(uploadedPath).data.publicUrl);
        }
      }
      
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          role: profile.role,
          phone: profile.phone,
          email: profile.email,
          address: profile.address,
          photo_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);
        
      if (error) {
        console.error("Profile save error:", error);
        toast({ title: "Profile not saved", description: error.message, variant: "destructive" });
      } else {
        console.log("Profile updated successfully");
        toast({ title: "Profile updated", description: "Your profile has been saved." });
        setAvatarFile(null);
      }
    } catch (err) {
      console.error("Unexpected save error:", err);
      toast({ title: "Save error", description: "An unexpected error occurred while saving", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 max-w-lg mx-auto">
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return <div className="p-6 text-center text-red-500">No profile found. Please try logging in again.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6 max-w-lg mx-auto" onSubmit={handleSave}>
          <div>
            <label className="block font-medium mb-1">Profile Photo</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border bg-gray-100 flex items-center justify-center overflow-hidden">
                {avatarURL ? (
                  <img src={avatarURL} alt="Avatar" className="object-cover w-full h-full" />
                ) : (
                  <User className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="block" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block font-medium mb-1">First Name</label>
              <Input
                value={profile.first_name || ""}
                onChange={e => setProfile({ ...profile, first_name: e.target.value })}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">Last Name</label>
              <Input
                value={profile.last_name || ""}
                onChange={e => setProfile({ ...profile, last_name: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Role</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={profile.role || "Staff"}
              onChange={e => setProfile({ ...profile, role: e.target.value as any })}
              required
            >
              {roles.map(r => <option key={r} value={r ?? "Staff"}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Phone</label>
            <Input
              value={profile.phone || ""}
              onChange={e => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <Input
              type="email"
              value={profile.email || ""}
              onChange={e => setProfile({ ...profile, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Address</label>
            <Textarea
              value={profile.address || ""}
              onChange={e => setProfile({ ...profile, address: e.target.value })}
              rows={2}
            />
          </div>
          <Button className="w-full mt-2" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
