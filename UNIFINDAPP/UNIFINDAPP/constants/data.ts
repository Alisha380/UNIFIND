import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const LOGO_DURATION = 2200;
export const SLIDE_INTERVAL = 3500;

export const LOGO_IMG = require("../assets/images/e6b78f23-cce2-43f1-aa5b-27d08570faf7 (1).jpeg");
export const AUTH_BG = require("../assets/images/IMG_9735.png");

export const slides = [
    { id: "1", image: require("../assets/images/IMG_9560.png") },
    { id: "2", image: require("../assets/images/IMG_9562.png") },
    { id: "3", image: require("../assets/images/IMG_9564.png") },
];

export type ItemStatus = 'Lost' | 'Found' | 'Claimed';
export type Category = 'Electronics' | 'Documents' | 'Personal' | 'Other';

export interface UniItem {
  id: string;
  name: string;
  location: string;
  status: ItemStatus;
  category: Category;
  timestamp: string;
  image: string;
  description: string;
  reporter: string;
}

export interface FormState {
  name: string;
  email: string;
  msg: string;
  type: ItemStatus;
}

export const MASTER_DATABASE: UniItem[] = [
  { id: 'UF-001', 
  name: 'MacBook Pro 14"', 
  location: 'Library - Floor 3', 
  status: 'Found', 
  category: 'Electronics', 
  timestamp: '12m ago', 
  image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800', 
  description: 'Silver color, found on desk 14. Has a university sticker.', 
  reporter: 'Staff-Admin'},
  { id: 'UF-002', name: 'Leather Wallet', location: 'Cafeteria A', status: 'Lost', category: 'Personal', timestamp: '1h ago', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800', description: 'Brown Fossil wallet with driving license.', reporter: 'Student-2021' },
  { id: 'UF-003', name: 'Sony XM5 Headphones', location: 'Innovation Hub', status: 'Found', category: 'Electronics', timestamp: '3h ago', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', description: 'Black color, found in the VR room.', reporter: 'Security-Post2' },
  { id: 'UF-004', 
  name: 'Plastic Water Bottle', 
  location: 'Sports Complex', 
  status: 'Found', 
  category: 'Personal',
  timestamp: '5h ago', 
  image: 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=800', 
  description: 'Simple reusable plastic bottle, blue tint with black cap. Found near the gym benches.', 
  reporter: 'Coach-Smith'},
  { id: 'UF-007', 
  name: 'Premium Makeup Palette', 
  location: 'Girls Common Room', 
  status: 'Lost', 
  category: 'Personal' ,
  timestamp: '2 hours ago', 
  image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop', 
  description: 'Nude shades palette with a built-in mirror. Brand: Sephora.', 
  reporter: 'Student-882'},
  { id: 'UF-006', name: 'North Face Backpack', location: 'Bus Terminal', status: 'Found', category: 'Personal', timestamp: '2d ago', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', description: 'Black backpack containing notebooks.', reporter: 'Driver-K' },
];