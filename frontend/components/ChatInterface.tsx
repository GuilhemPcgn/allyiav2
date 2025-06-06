// 'use client';

// import { useState } from 'react';
// import { Send } from 'lucide-react';

// const initialMessages = [
//     {
//         role: 'assistant',
//         content: 'Bonjour, je suis la pour vous écouter, et discuter avec vous. Comment puis-je vous aider aujourd\'hui ?'
//     }
// ];

// export function ChatInterface() {
//     const [messages, setMessages] = useState(initialMessages);
//     const [newMessage, setNewMessage] = useState('');

//     const handleSend = (e) => {
//         e.preventDefault();
//         if (!newMessage.trim()) return;

//         // ajout user message
//         const userMessage = {role: 'user', content: newMessage };
//         setMessages(prev => [...prev, userMessage]);

//         // simulation réponse (a remplacer par l'API)
//         setTimeout(() => {
//             const assistantMessage = {
//                 role: 'assistant',
//                 content: 'Je comprends ce que vous ressentez. Pouvez vous m\'en dire plus ?'
//             };
//             setMessages(prev => [...prev, assistantMessage]);
//     }, 1000);

//     setNewMessage('');
// };

// return (
//     <>
//         <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             {messages.map((message, index) => (
//                 <div
//                     key={index}
//                     className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
//                 >
//                     <div
//                         className={`max-w-[80%] rounded-2xl px-4 py-2 ${
//                             message.role === 'user'
//                                 ? 'bg-blue-600 text-white'
//                                 : 'bg-white border border-gray-200'
//                         }`}
//                         >
//                             <p className="text-sm">{message.content}</p>
//                     </div>
//             </div>
//             ))}
//         </div>

//         <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-200">
//         <div className="flex gap-2">
//             <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 placeholder="Ecrivez votre message..."
//                 className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
//                 />
//             <button
//             type="submit"
//             className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors"
//             >
//                 <Send className="w-5 h-5" />
//             </button>
//         </div>
//     </form>
// </>
//         );
//     }
