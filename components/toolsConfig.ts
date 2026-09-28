import { View } from '../types';

export interface ToolDef {
  view: View;
  title: string;
  desc: string;
  icon: string;
  color: string;
  iconColor: string;
}

export const TOOLS: ToolDef[] = [
  {
    view: 'post',
    title: "Today's Post",
    desc: 'Caption + Matching Visual Prompt',
    icon: '✨',
    color: 'bg-purple-50',
    iconColor: 'text-purple-600'
  },
  {
    view: 'offer',
    title: 'Offer Post',
    desc: 'Promote a product or seasonal discount',
    icon: '🏷️',
    color: 'bg-orange-50',
    iconColor: 'text-orange-600'
  },
  {
    view: 'reply',
    title: 'Reply Assistant',
    desc: 'Professional replies to customer queries',
    icon: '💬',
    color: 'bg-green-50',
    iconColor: 'text-green-600'
  },
  {
    view: 'broadcast',
    title: 'Broadcast Message',
    desc: 'Engagement-focused mass messages',
    icon: '📢',
    color: 'bg-blue-50',
    iconColor: 'text-blue-600'
  },
  {
    view: 'prompt',
    title: 'Image Designer',
    desc: 'Structured prompts for visual ideas',
    icon: '🎨',
    color: 'bg-pink-50',
    iconColor: 'text-pink-600'
  },
  {
    view: 'planner',
    title: 'Monthly Planner',
    desc: 'Generate a 30-day content outline',
    icon: '📅',
    color: 'bg-indigo-50',
    iconColor: 'text-indigo-600'
  }
];
