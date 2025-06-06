'use client';

import { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessage: Message = { role: 'user',content: input };
        setMessages((prev) => [...prev, newMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, newMessage].map(msg => ({
                        role: msg.role,
                        content: msg.content
                    }))
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status ${response.status}`);
            }


            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            if (data.response ) {
                setMessages((prev) => [
                    ...prev,
                    { role: 'assistant', content: data.response.content },
                ]);
            } else {
                throw new Error('No response from API');
            }
        } catch (error: any) {
            console.error('Error:', error);
            toast.error(error.message || 'Failed to get response from AI');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex-col items-center bg-gradient-to-b from-gray-50 to-gray-100 p-4'>
            <Card className='w-full max-w-2xl rounded-xl bg-white p-6shadow-xl'>
                <div className='mb-4 flex items-center space-x-2'>
                    <Bot className='h-8 w-8 text-blue-500' />
                    <h1 className='text-2xl font-bold text-gray-800'>Allyia</h1>
                </div>

                <ScrollArea className='h-[500px] rounded-md border p-4'>
                    <div className='space-y-4'>
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex items-start space-x-2 ${
                                    message.role === 'assistant' 
                                    ? 'flex-row' 
                                    : 'flex-row-reverse'
                                }`}
                                >
                                    <div className={`flex h-8 w-8 items-center justify-content rounded-full ${
                                        message.role === 'assistant' 
                                        ? 'bg-blue-100 texte-blue-500' 
                                        : 'bg-green-100 text-green-500'
                                    }`}
                                    >
                                        {message.role === 'assistant'
                                        ? ( <Bot className='h-5 w-5' /> )
                                        : ( <User className='h-5 w-5' /> )
                                        }
                                        </div>
                                        <div className={`max-w-[80%] rounded-lg p-3 ${
                                            message.role === 'assistant'
                                            ? 'bg-blue-50 text-gray-800'
                                            : 'bg-green-50 text-gray'
                                        }`}
                                        >
                                            {message.content}
                                        </div>
                                    </div>
                        ))}
                        {isLoading && (
                            <div className='flex items-center space-x-2'>
                                <div className='h-2 w-2 animate-bounce rounded-full bg-gray-400'></div>
                                <div className='h-2 w-2 animate-bounce rounded-full bg-gray-400' style={{ animationDelay: '0.2s' }}></div>
                                <div className='h-2 w-2 animate-bounce rounded-full bg-gray-400' style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <form onSubmit={handleSubmit} className='mt-4 flex space-x-2'>
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Comment s'est passé ta journée ?"
                        className='flex-1'
                        disabled={isLoading}
                    />
                    <Button type='submit' disabled={isLoading}>
                        <Send className='h-4 w-4' />
                    </Button>
                </form>
            </Card>
        </div>
    );
}
