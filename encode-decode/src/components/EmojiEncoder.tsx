import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Unlock, Copy, RefreshCw, Eye, EyeOff, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EmojiEncoder = () => {
  const [originalText, setOriginalText] = useState('');
  const [encodedText, setEncodedText] = useState('');
  const [decodedText, setDecodedText] = useState('');
  const [encodePassword, setEncodePassword] = useState('');
  const [decodePassword, setDecodePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Emoji mapping for encoding
  const emojiSets = [
    '🌟🎯🚀🎨🎭🎪🎸🎹🎲🎮🎯🎊🎈🎁🎀💝🎉🎆🎇✨🌈🌸🌺🌻🌷🌹🌲🌳🌴🌱🌿🍀🌾',
    '😀😃😄😁😆😅😂🤣😊😇🙂🙃😉😌😍🥰😘😗😙😚😋😛😝😜🤪🤨🧐🤓😎🤩🥳😏😒😞😔😟😕',
    '🐶🐱🐭🐹🐰🦊🐻🐼🐨🐯🦁🐮🐷🐽🐸🐵🙈🙉🙊🐒🐔🐧🐦🐤🐣🐥🦆🦅🦉🦇🐺🐗🐴🦄',
    '🍎🍐🍊🍋🍌🍉🍇🍓🍈🍒🍑🥭🍍🥥🥝🍅🍆🥑🥦🥬🥒🌶️🌽🥕🥔🍠🥐🍞🥖🥨🧀🥯',
    '⚽🏀🏈⚾🥎🎾🏐🏉🥏🎱🪀🏓🏸🏒🏑🥍🏏🪃🥅⛳🪁🏹🎣🤿🥊🥋🎽🛹🛷⛸️🥌🎿'
  ];

  // Create a comprehensive character to emoji mapping
  const createEmojiMap = (password: string) => {
    const allEmojis = emojiSets.join('');
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,!?;:-()[]{}"\'/\\@#$%^&*+=<>|~`';
    
    // Use password to create a pseudo-random seed
    let seed = 0;
    for (let i = 0; i < password.length; i++) {
      seed += password.charCodeAt(i) * (i + 1);
    }
    
    // Shuffle emojis based on password
    const shuffledEmojis = [...allEmojis].sort(() => {
      seed = (seed * 9301 + 49297) % 233280;
      return (seed / 233280) - 0.5;
    });
    
    const map = new Map();
    const reverseMap = new Map();
    
    for (let i = 0; i < chars.length && i < shuffledEmojis.length; i++) {
      map.set(chars[i], shuffledEmojis[i]);
      reverseMap.set(shuffledEmojis[i], chars[i]);
    }
    
    return { map, reverseMap };
  };

  const encodeMessage = async () => {
    if (!originalText.trim()) {
      toast({
        title: "No message to encode",
        description: "Please enter a message to encode",
        variant: "destructive",
      });
      return;
    }

    if (!encodePassword.trim()) {
      toast({
        title: "Password required",
        description: "Please enter a password for encoding",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate encoding delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const { map } = createEmojiMap(encodePassword);
      let encoded = '';
      
      for (const char of originalText) {
        encoded += map.get(char) || char;
      }
      
      setEncodedText(encoded);
      toast({
        title: "🎉 Message encoded successfully!",
        description: "Your secret message is ready to share",
      });
    } catch (error) {
      toast({
        title: "Encoding failed",
        description: "An error occurred while encoding your message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const decodeMessage = async () => {
    if (!encodedText.trim()) {
      toast({
        title: "No message to decode",
        description: "Please enter an encoded message to decode",
        variant: "destructive",
      });
      return;
    }

    if (!decodePassword.trim()) {
      toast({
        title: "Password required",
        description: "Please enter the correct password for decoding",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate decoding delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const { reverseMap } = createEmojiMap(decodePassword);
      let decoded = '';
      
      for (const emoji of encodedText) {
        decoded += reverseMap.get(emoji) || emoji;
      }
      
      setDecodedText(decoded);
      toast({
        title: "🔓 Message decoded successfully!",
        description: "The secret has been revealed",
      });
    } catch (error) {
      toast({
        title: "Decoding failed",
        description: "Check your password and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: `📋 ${type} copied!`,
        description: "Ready to share with your friends",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const clearAll = () => {
    setOriginalText('');
    setEncodedText('');
    setDecodedText('');
    setEncodePassword('');
    setDecodePassword('');
    toast({
      title: "🧹 All cleared!",
      description: "Ready for a new secret message",
    });
  };

  const generateRandomMessage = () => {
    const sampleMessages = [
      "Meet me at the secret hideout at midnight! 🌙",
      "The treasure is buried under the old oak tree 🌳",
      "Pizza party at my house this Friday! 🍕",
      "I have a surprise for you tomorrow! 🎁",
      "Don't tell anyone, but I have a crush on someone 💕"
    ];
    const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    setOriginalText(randomMessage);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="w-12 h-12 text-primary animate-pulse-glow" />
            <h1 className="text-5xl font-bold text-primary">
              🔐 Emoji Encoder
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your messages into secret emoji codes that only you and your friends can decode with the right password!
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="encode" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="encode" className="text-lg py-3 text-center">
              🔒 Encode Message
            </TabsTrigger>
            <TabsTrigger value="decode" className="text-lg py-3 text-center">
              🔓 Decode Message
            </TabsTrigger>
          </TabsList>

          {/* Encode Tab */}
          <TabsContent value="encode" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Input Section */}
              <Card className="bg-gradient-card border-border shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Original Message
                  </CardTitle>
                  <CardDescription>
                    Enter your secret message to encode
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="original-text">Your Message</Label>
                    <Textarea
                      id="original-text"
                      placeholder="Type your secret message here..."
                      value={originalText}
                      onChange={(e) => setOriginalText(e.target.value)}
                      className="min-h-[120px] bg-background/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="encode-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="encode-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter encoding password"
                        value={encodePassword}
                        onChange={(e) => setEncodePassword(e.target.value)}
                        className="pr-10 bg-background/50"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={encodeMessage}
                      disabled={isLoading}
                      className="flex-1"
                      variant="timer"
                    >
                      {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                      {isLoading ? "Encoding..." : "Encode Message"}
                    </Button>
                    <Button
                      onClick={generateRandomMessage}
                      variant="outline"
                      size="icon"
                      title="Generate sample message"
                    >
                      🎲
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Output Section */}
              <Card className="bg-gradient-card border-border shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🎭 Encoded Message
                  </CardTitle>
                  <CardDescription>
                    Your secret emoji-encoded message
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Encoded Result</Label>
                    <Textarea
                      value={encodedText}
                      readOnly
                      placeholder="Your encoded message will appear here..."
                      className="min-h-[120px] bg-background/50 font-mono text-lg"
                    />
                  </div>
                  
                  {encodedText && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyToClipboard(encodedText, "Encoded message")}
                        variant="outline"
                        className="flex-1"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Encoded Message
                      </Button>
                      <Button
                        onClick={() => setEncodedText(encodedText)}
                        variant="ghost"
                        size="icon"
                        title="Use for decoding"
                      >
                        ➡️
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Decode Tab */}
          <TabsContent value="decode" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Input Section */}
              <Card className="bg-gradient-card border-border shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Unlock className="w-5 h-5" />
                    Encoded Message
                  </CardTitle>
                  <CardDescription>
                    Paste the emoji-encoded message to decode
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="encoded-input">Encoded Message</Label>
                    <Textarea
                      id="encoded-input"
                      placeholder="Paste the encoded emoji message here..."
                      value={encodedText}
                      onChange={(e) => setEncodedText(e.target.value)}
                      className="min-h-[120px] bg-background/50 font-mono text-lg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="decode-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="decode-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter decoding password"
                        value={decodePassword}
                        onChange={(e) => setDecodePassword(e.target.value)}
                        className="pr-10 bg-background/50"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={decodeMessage}
                    disabled={isLoading}
                    className="w-full"
                    variant="timer"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
                    {isLoading ? "Decoding..." : "Decode Message"}
                  </Button>
                </CardContent>
              </Card>

              {/* Output Section */}
              <Card className="bg-gradient-card border-border shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    📝 Decoded Message
                  </CardTitle>
                  <CardDescription>
                    The revealed secret message
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Decoded Result</Label>
                    <Textarea
                      value={decodedText}
                      readOnly
                      placeholder="The decoded message will appear here..."
                      className="min-h-[120px] bg-background/50"
                    />
                  </div>
                  
                  {decodedText && (
                    <Button
                      onClick={() => copyToClipboard(decodedText, "Decoded message")}
                      variant="outline"
                      className="w-full"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Decoded Message
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Controls */}
        <div className="flex justify-center">
          <Button
            onClick={clearAll}
            variant="reset"
            size="lg"
            className="gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Clear All
          </Button>
        </div>

        {/* Info Section */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💡 How it works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">🔒 Encoding</h4>
                <p>Each character in your message is mapped to a unique emoji based on your password.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">🔑 Password Protection</h4>
                <p>Your password determines the emoji mapping. Same password = same encoding pattern.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">🤝 Sharing</h4>
                <p>Share the encoded message and password separately for maximum security.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmojiEncoder;