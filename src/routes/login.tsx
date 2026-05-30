import { useState } from "react";
import { Button } from "@/componentss/ui/button";
import { Input } from "@/componentss/ui/input";
import { Label } from "@/componentss/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/componentss/ui/card";
import { Stethoscope } from "lucide-react";

interface LoginPageProps {
  onLogin: (username: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 -left-40 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-96 h-96 bg-sky-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <Card className="w-full max-w-md z-10 border-slate-200/60 shadow-xl bg-white/80 backdrop-blur-xl">
        <CardHeader className="space-y-3 items-center text-center pb-6">
          <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-2">
            <Stethoscope className="h-7 w-7 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Welcome to Biomed Clinic</CardTitle>
          <CardDescription className="text-slate-500 font-medium">
            Enter your name to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-700 font-semibold">Your Name</Label>
              <Input
                id="username"
                placeholder="e.g. Dr. Admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11 bg-white border-slate-200 focus-visible:ring-blue-600"
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-md mt-4">
              Continue to Dashboard
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
