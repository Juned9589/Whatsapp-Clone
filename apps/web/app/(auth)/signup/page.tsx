"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSignUp } from "@/hooks/useSignup";

export default function SignupPage() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const signUp = useSignUp()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        signUp.mutate({ name, email, password })
    }

    return (
        <div className="min-h-screen bg-[#0B1414] flex">
            {/* Left branding panel — desktop only */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
                {/* floating chat-bubble shapes */}
                <div className="absolute w-72 h-72 rounded-[2rem] bg-[#2DD4A7]/10 rotate-12 top-16 left-16 animate-pulse" />
                <div className="absolute w-48 h-48 rounded-[2rem] bg-[#2DD4A7]/5 -rotate-6 bottom-24 left-32" />
                <div className="absolute w-32 h-32 rounded-full bg-[#2DD4A7]/10 bottom-40 right-20" />

                <div className="relative z-10 px-12 max-w-md">
                    <div className="w-12 h-12 rounded-2xl bg-[#2DD4A7] flex items-center justify-center mb-8">
                        <span className="text-[#0B1414] font-bold text-xl font-[family-name:var(--font-display)]">W</span>
                    </div>
                    <h1 className="font-[family-name:var(--font-display)] text-5xl font-medium text-[#EAF6F2] leading-tight mb-4">
                        Join the conversation

                    </h1>
                    <p className="text-[#7FA69B] text-lg font-[family-name:var(--font-body)]">
                        Real-time messaging built for speed — no lag, no clutter, just the people you talk to most.
                    </p>
                </div>
            </div>

            {/* Right — login form */}
            <form onSubmit={handleSubmit} className="w-full lg:w-1/2 flex items-center justify-center p-6">
                <Card className="w-full max-w-sm bg-[#121D1C] border-[#1E2E2C] shadow-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="font-[family-name:var(--font-display)] text-2xl text-[#EAF6F2]">
                            Create account
                        </CardTitle>
                        <p className="text-sm text-[#7FA69B]">Sign up to get started</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-[#EAF6F2]">Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                placeholder="your name"
                                className="bg-[#0B1414] border-[#1E2E2C] text-[#EAF6F2] placeholder:text-[#4A6660] focus-visible:ring-[#2DD4A7]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[#EAF6F2]">Email</Label>
                            <Input
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="you@example.com"
                                className="bg-[#0B1414] border-[#1E2E2C] text-[#EAF6F2] placeholder:text-[#4A6660] focus-visible:ring-[#2DD4A7]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-[#EAF6F2]">Password</Label>
                            <Input
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="••••••••"
                                className="bg-[#0B1414] border-[#1E2E2C] text-[#EAF6F2] placeholder:text-[#4A6660] focus-visible:ring-[#2DD4A7]"
                            />
                        </div>
                        <Button type="submit" disabled={signUp.isPending} className="w-full bg-[#2DD4A7] text-[#0B1414] hover:bg-[#2DD4A7]/90 font-medium">
                            {signUp.isPending ? "Signing up..." : "Sign up"}
                        </Button>
                        {signUp.isError && (
                            <p className="text-sm text-red-400 text-center">
                                {signUp.error.message}
                            </p>
                        )}
                        <p className="text-center text-sm text-[#7FA69B]">
                            Already have an account?{" "}
                            <a href="/login" className="text-[#2DD4A7] hover:underline">
                                Login
                            </a>
                        </p>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}