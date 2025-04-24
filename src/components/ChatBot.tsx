
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { MessageCircle } from "lucide-react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full bg-blue hover:bg-blue-dark text-white"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 h-96 p-0">
        <div className="flex flex-col h-full">
          <div className="bg-blue p-4 text-white">
            <h3 className="font-semibold">SS Steel Support</h3>
            <p className="text-sm opacity-90">Ask us anything!</p>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            <div className="bg-gray-100 p-2 rounded-lg max-w-[80%]">
              How can I help you today?
            </div>
          </div>
          <div className="p-4 border-t">
            <form className="flex gap-2">
              <Input
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" size="sm">
                Send
              </Button>
            </form>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ChatBot;
