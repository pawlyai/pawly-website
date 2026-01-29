import React from 'react';

export type Sender = 'user' | 'ai';

export interface Message {
  id: string;
  text: React.ReactNode;
  sender: Sender;
  timestamp: number;
}

export type ChatScenario = 'vomit' | 'scratch';