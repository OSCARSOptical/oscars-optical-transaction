import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";
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
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">User Profile</h2>
          <Skeleton className="h-10 w-24" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-10 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-center text-red-500">
        No profile found. Please try logging in again.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">User Profile</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form className="space-y-8" onSubmit={handleSave}>
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Profile Photo</h3>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-2 border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
                    {avatarURL ? (
                      <img src={avatarURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Update your photo (SVG, PNG, JPG or GIF, max. 800x800px)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-gray-100 file:text-gray-700
                      hover:file:bg-gray-200
                      cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <Input
                      value={profile.first_name || ""}
                      onChange={e => setProfile({ ...profile, first_name: e.target.value })}
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <Input
                      value={profile.last_name || ""}
                      onChange={e => setProfile({ ...profile, last_name: e.target.value })}
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={profile.email || ""}
                      onChange={e => setProfile({ ...profile, email: e.target.value })}
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <Input
                      value={profile.phone || ""}
                      onChange={e => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={profile.role || "Staff"}
                      onChange={e => setProfile({ ...profile, role: e.target.value as Profile["role"] })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      {roles.map(r => <option key={r} value={r ?? "Staff"}>{r}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <Textarea
                      value={profile.address || ""}
                      onChange={e => setProfile({ ...profile, address: e.target.value })}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
