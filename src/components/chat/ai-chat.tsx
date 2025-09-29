
'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Loader2, Send, X, Download, History, User, FileDown, FileText } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';
import type { Locale } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppContext } from '@/context/app-context';
import { chat } from '@/ai/flows/chat-flow';
import type { ChatInput } from '@/ai/flows/chat-types';
import { Card, CardContent } from '../ui/card';
import { DownloadPdfDialog } from '../members/download-pdf-dialog';
import { DownloadStatementDialog } from '../dashboard/download-statement-dialog';

type Message = {
  id: string;
  role: 'user' | 'model';
  uiContent: React.ReactNode;
  historyContent: { text: string }[] | { toolResponse: any }[];
};

export function AiChat() {
  const { language } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const [isMemberPdfOpen, setMemberPdfOpen] = useState(false);
  const [memberForPdf, setMemberForPdf] = useState<string | null>(null);
  const [isStatementPdfOpen, setStatementPdfOpen] = useState(false);


  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMessage = 'Assalamu Alaikum! Welcome to Seva Sangathan. I hope you are doing well. How can I help you today?';
      setMessages([
        {
          id: 'init',
          role: 'model',
          uiContent: initialMessage,
          historyContent: [{ text: initialMessage }],
        },
      ]);
      setShowSuggestions(true);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const callChatApi = async (history: any[], message: string) => {
    const chatInput: ChatInput = {
      history: history,
      message: message,
    };
    return await chat(chatInput);
  };
  
  const handleUserInput = async (predefinedInput?: string) => {
    const currentInput = predefinedInput || input;
    if (!currentInput.trim()) return;
  
    setShowSuggestions(false);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      uiContent: currentInput,
      historyContent: [{ text: currentInput }],
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
  
    try {
      let currentHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.historyContent,
      }));
  
      let response = await callChatApi(currentHistory, currentInput);
  
      if (response.toolCalls && response.toolCalls.length > 0) {
        // Handle tool calls
        const toolCall = response.toolCalls[0];
        const toolResult = toolCall.result;
  
        const modelToolMessage: Message = {
          id: Date.now().toString() + '-tool',
          role: 'model',
          uiContent: null, // This message won't be rendered
          historyContent: [{ toolResponse: toolCall }],
        };
        
        // Add the tool response to history and make another call to get the final text
        currentHistory = [...currentHistory, 
          { role: 'user', content: [{text: currentInput}] },
          { role: 'model', content: modelToolMessage.historyContent }
        ];

        response = await callChatApi(currentHistory, ''); // No new user message, just process tool result

        let finalUiContent: React.ReactNode;
        const modelTextResponse = response.text || "I've processed that request.";

        if (toolCall.name === 'getMemberTransactionHistory') {
          if (toolResult?.history) {
            finalUiContent = <TransactionHistoryDisplay history={toolResult.history} />;
          } else {
            finalUiContent = toolResult?.error || 'Could not retrieve history.';
          }
        } else if (toolCall.name === 'prepareMemberPdfDownload') {
          if (toolResult?.success) {
            finalUiContent = (
              <div>
                <p>{modelTextResponse}</p>
                <Button size="sm" className="mt-2" onClick={() => {
                  setMemberForPdf(toolResult.memberName);
                  setMemberPdfOpen(true);
                }}>
                  <Download className="mr-2 h-4 w-4" /> Yes, Download
                </Button>
              </div>
            );
          } else {
            finalUiContent = toolResult?.error || 'Could not prepare the PDF.';
          }
        } else if (toolCall.name === 'prepareFinancialStatementDownload') {
            if (toolResult?.success) {
                finalUiContent = (
                     <div>
                        <p>{modelTextResponse}</p>
                        <Button size="sm" className="mt-2" onClick={() => setStatementPdfOpen(true)}>
                            <Download className="mr-2 h-4 w-4" /> Yes, Download Statement
                        </Button>
                    </div>
                );
            } else {
                 finalUiContent = 'Could not prepare the financial statement PDF.';
            }
        } else {
            finalUiContent = response.text;
        }

        const finalModelMessage: Message = {
            id: Date.now().toString() + '-ai',
            role: 'model',
            uiContent: finalUiContent,
            historyContent: [{ text: modelTextResponse }],
        };

        setMessages((prev) => [...prev, modelToolMessage, finalModelMessage]);


      } else if (response.text) {
        // Handle simple text response
        const modelMessage: Message = {
          id: Date.now().toString() + '-ai',
          role: 'model',
          uiContent: response.text,
          historyContent: [{ text: response.text }],
        };
        setMessages((prev) => [...prev, modelMessage]);
      } else {
        throw new Error("No valid response from AI");
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessageContent = 'Sorry, I encountered an error. Please try again.';
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        role: 'model',
        uiContent: errorMessageContent,
        historyContent: [{ text: errorMessageContent }]
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUserInput();
    }
  };
  
  const suggestionChips = [
    { label: 'Download Member PDF', icon: FileDown, action: () => handleUserInput('I want to download a member PDF')},
    { label: 'Download Financial Statement', icon: FileText, action: () => handleUserInput('Download financial statement')},
    { label: 'View Member History', icon: History, action: () => handleUserInput('Show me transaction history for a member')},
  ]

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-4 sm:right-8 z-50 w-[calc(100%-2rem)] max-w-md"
          >
            <Card className="h-[60vh] flex flex-col shadow-2xl">
              <header className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <Bot className="h-6 w-6 text-primary" />
                  <h3 className="text-lg font-semibold">{language === 'bn' ? 'সহকারী চ্যাট' : 'Assistant Chat'}</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </header>
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full" ref={scrollAreaRef}>
                  <div className="p-4 space-y-4">
                    {messages.map((m) => (
                      m.uiContent && <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {m.role === 'model' && <Bot className="h-6 w-6 text-primary flex-shrink-0" />}
                        <div className={`p-3 rounded-lg max-w-xs sm:max-w-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                          {typeof m.uiContent === 'string' ? <p className="text-sm whitespace-pre-wrap">{m.uiContent}</p> : m.uiContent}
                        </div>
                        {m.role === 'user' && <User className="h-6 w-6 text-muted-foreground flex-shrink-0" />}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start gap-3">
                        <Bot className="h-6 w-6 text-primary flex-shrink-0" />
                        <div className="p-3 rounded-lg bg-muted flex items-center">
                          <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                      </div>
                    )}
                    {showSuggestions && (
                       <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-2 pt-2 items-start"
                       >
                         {suggestionChips.map((chip, index) => (
                           <Button key={index} variant="outline" size="sm" onClick={chip.action} className="justify-start">
                             <chip.icon className="mr-2 h-4 w-4"/>
                             {chip.label}
                           </Button>
                         ))}
                       </motion.div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <footer className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button onClick={() => handleUserInput()} disabled={isLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </footer>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="fixed bottom-4 right-4 sm:right-8 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button size="lg" className="rounded-full shadow-lg h-16 w-16" onClick={() => setIsOpen((prev) => !prev)}>
          {isOpen ? <X className="h-8 w-8" /> : <Bot className="h-8 w-8" />}
          <span className="sr-only">Toggle Chat</span>
        </Button>
      </motion.div>
      <DownloadPdfDialog open={isMemberPdfOpen} onOpenChange={setMemberPdfOpen} preselectedMemberName={memberForPdf} />
      <DownloadStatementDialog open={isStatementPdfOpen} onOpenChange={setStatementPdfOpen} />
    </>
  );
}


function TransactionHistoryDisplay({ history }: { history: { date: string, description: string, amount: number }[] }) {
    const { language } = useAppContext();
    const [locale, setLocale] = useState<Locale>();

    useEffect(() => {
        const loadLocale = async () => {
            if (language === 'bn') {
                const { bn } = await import('date-fns/locale');
                setLocale(bn);
            } else {
                const { enUS } = await import('date-fns/locale/en-US');
                setLocale(enUS);
            }
        };
        loadLocale();
    }, [language]);


    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-US', {
            style: 'currency', currency: 'BDT', minimumFractionDigits: 0
        }).format(amount);
    };
    const formatDate = (date: string) => {
        try {
            return format(new Date(date), 'PP', { locale });
        } catch {
            return date;
        }
    };

    return (
        <div className="space-y-2 text-sm">
            <h4 className="font-bold">Transaction History</h4>
            {history.length > 0 ? (
                history.map((tx, index) => (
                    <div key={index} className="flex justify-between items-center bg-background p-2 rounded">
                        <div>
                            <p className="font-medium">{tx.description}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
                        </div>
                        <p className="font-semibold text-green-600">{formatCurrency(tx.amount)}</p>
                    </div>
                ))
            ) : (
                <p>No transactions found.</p>
            )}
        </div>
    );
}
