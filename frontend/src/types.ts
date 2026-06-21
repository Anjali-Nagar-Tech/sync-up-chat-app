import { ReactNode } from "react";
import {
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

export type TypoProps = {
  size?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  children: any | null;
  style?: TextStyle;
  textProps?: TextProps;
};

export interface UserProps {
  username: string;
  avatar?: string | null;
  id?: string;
}

export interface UserDataProps {
  username: string;
  avatar?: any;
}

// User returned from GET /api/users
export interface UserListItem {
  _id: string;
  username: string;
}

export interface InputProps extends TextInputProps {
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  inputRef?: React.RefObject<TextInput>;
}

export interface DecodedTokenProps {
  user: UserProps;
  exp: number;
  iat: number;
}

export type AuthContextProps = {
  token: string | null;
  user: UserProps | null;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateToken: (token: string) => Promise<void>;
};

export type ScreenWrapperProps = {
  style?: ViewStyle;
  children: React.ReactNode;
  isModal?: boolean;
  showPattern?: boolean;
  bgOpacity?: number;
};

export type ResponseProps = {
  success: boolean;
  data?: any;
  msg?: string;
};

export interface ButtonProps extends TouchableOpacityProps {
  style?: ViewStyle;
  onPress?: () => void;
  loading?: boolean;
  children: React.ReactNode;
}

export type BackButtonProps = {
  style?: ViewStyle;
  color?: string;
  iconSize?: number;
};

export type AvatarProps = {
  size?: number;
  uri: string | null;
  style?: ViewStyle;
  isGroup?: boolean;
};

export type HeaderProps = {
  title?: string;
  style?: ViewStyle;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

// Message returned from GET /api/messages/:userId
export type MessageProps = {
  _id: string;
  senderId: {
    _id: string;
    username: string;
  };
  receiverId: {
    _id: string;
    username: string;
  };
  content: string;
  isMe?: boolean;
  createdAt: string;
};

// Socket payload (before DB populate)
export type SocketMessagePayload = {
  _id: string;
  content: string;
  senderId: { id: string; username: string };
  receiverId: string;
  createdAt: string;
};

// For home screen conversation preview
export type ConversationPreview = {
  userId: string;
  username: string;
  lastMessage: string;
  time: string;
};
