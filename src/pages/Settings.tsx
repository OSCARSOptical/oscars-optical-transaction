
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Settings() {
  const [name, setName] = useState("OSCARS Optical Clinic");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [saved, setSaved] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
      setLogoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
    // Actual save would go here
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Clinic Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-medium mb-1">Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border bg-gray-100 flex items-center justify-center overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Preview" className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-xs text-gray-400">No logo</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="block"
                />
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1">Clinic Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter clinic name"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Phone</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(0917) 123-4567"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="clinic@email.com"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Address</label>
              <Textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                placeholder="Enter address..."
              />
            </div>
            <Button type="submit" className="w-full mt-2">
              Save Changes
            </Button>
            {saved && (
              <p className="text-green-600 text-center text-sm mt-2">Saved!</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
