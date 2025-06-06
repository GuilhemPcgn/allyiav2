'use client';

import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { signUp, signInWithGoogle, signInWithApple, loading, error } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }

        try {
            await signUp(email, password);
            router.push('/profil');
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
        }
    };

        return (
            <StyledWrapper>
                <div className="container">
                    <div className="heading">Inscription</div>
                    <form className="form" onSubmit={handleSubmit}>
                        <input 
                            required 
                            className="input" 
                            type="email" 
                            name="email" 
                            id="email" 
                            placeholder="E-mail" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
    
                        />
                        <input 
                            required 
                            className="input" 
                            type="password" 
                            name="password" 
                            id="password" 
                            placeholder="Mot De Passe" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                        <input 
                            required 
                            className="input" 
                            type="confirmPassword" 
                            name="confirmPassword" 
                            id="confirmPassword" 
                            placeholder="Confirmation Mot De Passe" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                        />
                        <span className="forgot-password">
                            <a href="#">Mot de passe oublié ?</a>
                        </span>
                        <input 
                            className="login-button" 
                            type="submit" 
                            defaultValue="S'inscrire"
                            disabled={loading}
                        />
                    </form>
                    <div className="social-account-container">
                        <span className="title">S'inscrire avec</span>
                        <div className="social-accounts">
                            <button 
                                className="social-button google" 
                                onClick={() => signInWithGoogle()}
                            >
                                <svg 
                                    className="svg" 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    height="1em" 
                                    viewBox="0 0 488 512"
                                >
                                    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                                </svg>
                            </button>
                            <button 
                                className="social-button apple"
                                onClick={() => signInWithApple()}
                            >
                                <svg 
                                    className="svg" 
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="1em"
                                    viewBox="0 0 384 512"
                                >
                                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="agreement">
                        <Checkbox className="rounded shadow-md" />{' '}
                        <span className="text-xs">J'accepte les</span>{' '}
                            <Link href="/terms" className="text-xs">
                            <span className="text-xs">termes et conditions</span>
                            </Link>{' '}
                            <span className="text-xs">et la</span>{' '}
                            <Link href="/privacy">
                            <span className="text-xs">politique de confidentialité</span>
                            </Link>
                    </div>
                </div>
            </StyledWrapper>
        );
    }
    
    const StyledWrapper = styled.div`
.container {
        max-width: 350px;
        background: #F8F9FD;
        background: linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%);
        border-radius: 40px;
        padding: 25px 35px;
        border: 5px solid rgb(255, 255, 255);
        box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 30px 30px -20px;
        margin: 20px;
}
    
.heading {
        text-align: center;
        font-weight: 900;
        font-size: 30px;
        color: rgb(16, 137, 211);
}
    
.form {
        margin-top: 20px;
}
    
.form .input {
        width: 100%;
        background: white;
        border: none;
        padding: 15px 20px;
        border-radius: 20px;
        margin-top: 15px;
        box-shadow: #cff0ff 0px 10px 10px -5px;
        border-inline: 2px solid transparent;
}
    
.form .input::-moz-placeholder {
        color: rgb(170, 170, 170);
}
    
.form .input::placeholder {
        color: rgb(170, 170, 170);
}
    
.form .input:focus {
        outline: none;
        border-inline: 2px solid #12B1D1;
}
    
.form .forgot-password {
        display: block;
        margin-top: 10px;
        margin-left: 10px;
}
    
.form .forgot-password a {
        font-size: 11px;
        color: #0099ff;
        text-decoration: none;
}
    
.form .login-button {
        display: block;
        width: 100%;
        font-weight: bold;
        background: linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%);
        color: white;
        padding-block: 15px;
        margin: 20px auto;
        border-radius: 20px;
        box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 20px 10px -15px;
        border: none;
        transition: all 0.2s ease-in-out;
}
    
.form .login-button:hover {
        transform: scale(1.03);
        box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 23px 10px -20px;
}
    
.form .login-button:active {
        transform: scale(0.95);
        box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 15px 10px -10px;
}
    
.social-account-container {
        margin-top: 25px;
}
    
.social-account-container .title {
        display: block;
        text-align: center;
        font-size: 10px;
        color: rgb(170, 170, 170);
}
    
.social-account-container .social-accounts {
        width: 100%;
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-top: 5px;
}
    
.social-account-container .social-accounts .social-button {
        background: linear-gradient(45deg, rgb(0, 0, 0) 0%, rgb(112, 112, 112) 100%);
        border: 5px solid white;
        padding: 5px;
        border-radius: 50%;
        width: 40px;
        aspect-ratio: 1;
        display: grid;
        place-content: center;
        box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 12px 10px -8px;
        transition: all 0.2s ease-in-out;
}
    
.social-account-container .social-accounts .social-button .svg {
        fill: white;
        margin: auto;
}
    
.social-account-container .social-accounts .social-button:hover {
        transform: scale(1.2);
}
    
.social-account-container .social-accounts .social-button:active {
        transform: scale(0.9);
}
    
.agreement {
        display: block;
        text-align: center;
        margin-top: 15px;
}
    
.agreement a {
        text-decoration: none;
        color: #0099ff;
        font-size: 9px;
}`;












































// 'use client';

// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { toast } from "sonner";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// // Enhanced validation schema with more specific rules
// const signupSchema = z.object({
//     firstname: z.string()
//         .min(2, 'First name must be at least 2 characters')
//         .max(100, 'First name must be less than 100 characters')
//         .regex(/^[a-zA-Z\s-]+$/, 'First name can only contain letters, spaces, and hyphens'),
//     lastname: z.string()
//         .min(2, 'Last name must be at least 2 characters')
//         .max(100, 'Last name must be less than 100 characters')
//         .regex(/^[a-zA-Z\s-]+$/, 'Last name can only contain letters, spaces, and hyphens'),
//     email: z.string()
//         .email('Please enter a valid email address')
//         .max(255, 'Email must be less than 255 characters'),
//     phone: z.string()
//         .max(20, 'Phone number must be less than 20 characters')
//         .regex(/^[0-9+\s-]*$/, 'Invalid phone number format')
//         .optional()
//         .or(z.literal('')),
//     adress: z.string()
//         .max(255, 'Address must be less than 255 characters')
//         .optional()
//         .or(z.literal('')),
//     birthdate: z.string()
//         .refine((date) => {
//             const parsed = new Date(date);
//             const now = new Date();
//             return parsed < now && parsed > new Date('1900-01-01');
//         }, 'Please enter a valid birth date'),
//     sex: z.enum(['Man', 'Woman', 'Other'], {
//         required_error: 'Please select your gender',
//     }),
//     role: z.enum(['Patient', 'Doctor', 'Pharmacist'], {
//         required_error: 'Please select your role',
//     }),
//     password: z.string()
//         .min(8, 'Password must be at least 8 characters')
//         .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
//         .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
//         .regex(/[0-9]/, 'Password must contain at least one number')
//         .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
//     confirmPassword: z.string()
// }).refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ["confirmPassword"],
// });

// export default function SignupPage() {
//     const router = useRouter();
//     const [isLoading, setIsLoading] = useState(false);

//     // Initialize form with react-hook-form and zod resolver
//     const form = useForm({
//         resolver: zodResolver(signupSchema),
//         defaultValues: {
//             firstname: '',
//             lastname: '',
//             email: '',
//             phone: '',
//             adress: '',
//             birthdate: '',
//             sex: undefined,
//             role: undefined,
//             password: '',
//             confirmPassword: ''
//         }
//     });

//     const onSubmit = async (data) => {
//         console.log("Sending signup data:", data); // ✅ Vérifie si le formulaire envoie encore les données
    
//         try {
//             setIsLoading(true);
//             const { confirmPassword, ...signupData } = data;
    
//             const response = await fetch("http://localhost:5848/api/auth/signup", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify(signupData)
//             });
    
//             console.log("Request sent, awaiting response..."); // ✅ Vérifie si la requête part
    
//             const responseData = await response.json();
//             console.log("Response from backend:", responseData); // ✅ Vérifie la réponse backend
    
//             if (response.ok) {
//                 toast.success("Account created successfully!");
//                 router.push("/dashboard");
//             } else {
//                 toast.error(responseData.error || "An error occurred");
//             }
//          } catch (error) {
//             console.error("❌ Signup error:", error);
//             toast.error("An unexpected error occurred");
//         } finally {
//             setIsLoading(false);
//         }
//     };
    
    

//     return (
//         <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
//             <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
//                 <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Create Account</h1>

//                 <Form {...form}>
//                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                         <div className="grid grid-cols-2 gap-4">
//                             <FormField
//                                 control={form.control}
//                                 name="firstname"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormControl>
//                                             <Input placeholder="First Name" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="lastname"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormControl>
//                                             <Input placeholder="Last Name" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                         </div>

//                         <FormField
//                             control={form.control}
//                             name="email"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormControl>
//                                         <Input type="email" placeholder="Email" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="phone"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormControl>
//                                         <Input placeholder="Phone (optional)" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="adress"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormControl>
//                                         <Input placeholder="Address (optional)" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="birthdate"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormControl>
//                                         <Input type="date" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="sex"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                         <FormControl>
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="Select Gender" />
//                                             </SelectTrigger>
//                                         </FormControl>
//                                         <SelectContent>
//                                             <SelectItem value="Man">Man</SelectItem>
//                                             <SelectItem value="Woman">Woman</SelectItem>
//                                             <SelectItem value="Other">Other</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="role"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                         <FormControl>
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="Select Role" />
//                                             </SelectTrigger>
//                                         </FormControl>
//                                         <SelectContent>
//                                             <SelectItem value="Patient">Patient</SelectItem>
//                                             <SelectItem value="Doctor">Doctor</SelectItem>
//                                             <SelectItem value="Pharmacist">Pharmacist</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="password"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormControl>
//                                         <Input type="password" placeholder="Password" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="confirmPassword"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormControl>
//                                         <Input type="password" placeholder="Confirm Password" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <Button type="submit" className="w-full" disabled={isLoading}>
//                             {isLoading ? 'Creating Account...' : 'Sign Up'}
//                         </Button>
//                     </form>
//                 </Form>
//             </div>
//         </div>
//     );
// }




// // 'use client';

// // import { useState } from 'react';
// // import { useRouter } from 'next/navigation';

// // export default function Signup() {
// //     const [formData, setFormData] = useState({
// //         firstname: '',
// //         lastname: '',
// //         email: '',
// //         phone: '',
// //         adress: '',
// //         birthdate: '',
// //         sex: '',
// //         role: '',
// //         password: '',
// //     });

// //     const router = useRouter();

// //     const handleChange = (e) => {
// //         setFormData({ ...formData, [e.target.name]: e.target.value });
// //     };

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();

// //         try {
// //             const response = await fetch('http://localhost:5848/api/auth/signup', {
// //                 method: 'POST',
// //                 headers: {
// //                     'Content-Type': 'application/json',
// //                 },
// //                 body: JSON.stringify(formData),
// //             });

// //             if (response.ok) {
// //                 const data = await response.json();
// //                 console.log('User created successfully:', data);
// //                 router.push('/login'); // Rediriger vers la page de connexion
// //             } else {
// //                 const errorData = await response.json();
// //                 console.error('Error during signup:', errorData);
// //                 alert(`Error: ${errorData.error || 'Something went wrong'}`);
// //             }
// //         } catch (error) {
// //             console.error('Network error:', error);
// //             alert('Network error. Please try again.');
// //         }
// //     };

// //     return (
// //         <form onSubmit={handleSubmit}>
// //             <input type="text" name="firstname" placeholder="Firstname" onChange={handleChange} required />
// //             <input type="text" name="lastname" placeholder="Lastname" onChange={handleChange} required />
// //             <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
// //             <input type="text" name="phone" placeholder="Phone" onChange={handleChange} />
// //             <input type="text" name="adress" placeholder="Adress" onChange={handleChange} />
// //             <input type="date" name="birthdate" placeholder="Birthdate" onChange={handleChange} required />
// //             <select name="sex" onChange={handleChange} required>
// //                 <option value="">Select Sex</option>
// //                 <option value="Man">Man</option>
// //                 <option value="Woman">Woman</option>
// //                 <option value="Other">Other</option>
// //             </select>
// //             <select name="role" onChange={handleChange} required>
// //                 <option value="">Select Role</option>
// //                 <option value="Patient">Patient</option>
// //                 <option value="Doctor">Doctor</option>
// //                 <option value="Pharmacist">Pharmacist</option>
// //             </select>
// //             <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
// //             <button type="submit">Sign Up</button>
// //         </form>
// //     );
// // }








// // // 'use client';

// // // import { useState } from 'react';
// // // import { useForm } from 'react-hook-form';
// // // import { zodResolver } from '@hookform/resolvers/zod';
// // // import * as z from 'zod';
// // // import axios from 'axios';
// // // import { useRouter } from 'next/navigation';
// // // import { Button } from "@/components/ui/button";
// // // import { Input } from "@/components/ui/input";
// // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// // // import { toast } from "sonner";

// // // const signupSchema = z.object({
// // //     firstname: z.string().min(2, 'First name is required'),
// // //     lastname: z.string().min(2, 'Last name is required'),
// // //     email: z.string().email('Invalid email address'),
// // //     phone: z.string().optional(),
// // //     adress: z.string().optional(),
// // //     birthdate: z.string().refine((date) => !isNaN(Date.parse(date)), {
// // //         message: 'Invalid date format',
// // //     }),
// // //     sex: z.enum(['Man', 'Woman', 'Other']),
// // //     role: z.enum(['Patient', 'Doctor', 'Pharmacist']),
// // //     password: z.string().min(6, 'Password must be at least 6 characters'),
// // //     confirmPassword: z.string()
// // // }).refine((data) => data.password === data.confirmPassword, {
// // //     message: "Passwords don't match",
// // //     path: ["confirmPassword"],
// // // });

// // // export default function SignupPage() {
// // //     const router = useRouter();
// // //     const [isLoading, setIsLoading] = useState(false);

// // //     const { register, handleSubmit, setValue, formState: { errors } } = useForm({
// // //         resolver: zodResolver(signupSchema),
// // //         defaultValues: {
// // //             firstname: '',
// // //             lastname: '',
// // //             email: '',
// // //             phone: '',
// // //             adress: '',
// // //             birthdate: '',
// // //             sex: undefined,
// // //             role: undefined,
// // //             password: '',
// // //             confirmPassword: ''
// // //         }
// // //     });

// // //     const onSubmit = async (data) => {
// // //         try {
// // //             setIsLoading(true);
// // //             const { confirmPassword, ...signupData } = data;

// // //             const response = await axios.post('http://localhost:5848/api/auth/register', signupData, {
// // //                 headers: {
// // //                     'Content-Type': 'application/json'
// // //                 }
// // //             });

// // //             if (response.data.user) {
// // //                 localStorage.setItem('token', response.data.token);
// // //                 toast.success('Account created successfully!');
// // //                 router.push('/dashboard');
// // //             }
// // //         } catch (error) {
// // //             toast.error(error.response?.data?.error || 'An error occurred during signup');
// // //         } finally {
// // //             setIsLoading(false);
// // //         }
// // //     };

// // //     return (
// // //         <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
// // //             <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
// // //                 <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Create Account</h1>

// // //                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
// // //                     <div className="grid grid-cols-2 gap-4">
// // //                         <div>
// // //                             <Input {...register('firstname')} placeholder="First Name" className={errors.firstname ? 'border-red-500' : ''} />
// // //                             {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname.message}</p>}
// // //                         </div>
// // //                         <div>
// // //                             <Input {...register('lastname')} placeholder="Last Name" className={errors.lastname ? 'border-red-500' : ''} />
// // //                             {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname.message}</p>}
// // //                         </div>
// // //                     </div>
// // //                     <div>
// // //                         <Input {...register('email')} type="email" placeholder="Email" className={errors.email ? 'border-red-500' : ''} />
// // //                         {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
// // //                     </div>
// // //                     <Input {...register('phone')} placeholder="Phone (optional)" />
// // //                     <Input {...register('adress')} placeholder="Address (optional)" />
// // //                     <div>
// // //                         <Input {...register('birthdate')} type="date" className={errors.birthdate ? 'border-red-500' : ''} />
// // //                         {errors.birthdate && <p className="text-red-500 text-sm">{errors.birthdate.message}</p>}
// // //                     </div>

// // //                     <div>
// // //                         <Select onValueChange={(value) => setValue('sex', value)}>
// // //                             <SelectTrigger className={errors.sex ? 'border-red-500' : ''}>
// // //                                 <SelectValue placeholder="Select Gender" />
// // //                             </SelectTrigger>
// // //                             <SelectContent>
// // //                                 <SelectItem value="Man">Man</SelectItem>
// // //                                 <SelectItem value="Woman">Woman</SelectItem>
// // //                                 <SelectItem value="Other">Other</SelectItem>
// // //                             </SelectContent>
// // //                         </Select>
// // //                         {errors.sex && <p className="text-red-500 text-sm">Gender is required</p>}
// // //                     </div>

// // //                     <div>
// // //                         <Select onValueChange={(value) => setValue('role', value)}>
// // //                             <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
// // //                                 <SelectValue placeholder="Select Role" />
// // //                             </SelectTrigger>
// // //                             <SelectContent>
// // //                                 <SelectItem value="Patient">Patient</SelectItem>
// // //                                 <SelectItem value="Doctor">Doctor</SelectItem>
// // //                                 <SelectItem value="Pharmacist">Pharmacist</SelectItem>
// // //                             </SelectContent>
// // //                         </Select>
// // //                         {errors.role && <p className="text-red-500 text-sm">Role is required</p>}
// // //                     </div>

// // //                     <div>
// // //                         <Input {...register('password')} type="password" placeholder="Password" className={errors.password ? 'border-red-500' : ''} />
// // //                         {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
// // //                     </div>
// // //                     <div>
// // //                         <Input {...register('confirmPassword')} type="password" placeholder="Confirm Password" className={errors.confirmPassword ? 'border-red-500' : ''} />
// // //                         {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
// // //                     </div>

// // //                     <Button type="submit" className="w-full" disabled={isLoading}>
// // //                         {isLoading ? 'Creating Account...' : 'Sign Up'}
// // //                     </Button>
// // //                 </form>
// // //             </div>
// // //         </div>
// // //     );
// // // }