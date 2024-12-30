import {
  CircleCheckIcon,
  CircleXIcon,
  LoaderCircleIcon,
} from "lucide-react-native";
import { colors } from "./utils";

export const STATUS_COLOR = [
  {
    color: colors._green,
    statuses: ["approved", "approve", "success", "active"],
    icon: CircleCheckIcon,
  },
  {
    color: colors._gold3,
    statuses: ["pending", "installment"],
    icon: LoaderCircleIcon,
  },
  {
    color: colors._red,
    statuses: [
      "rejected",
      "reject",
      "canceled",
      "cancel",
      "expired",
      "expire",
      "failed",
    ],
    icon: CircleXIcon,
  },
  {
    color: colors._blue2,
    statuses: ["default", "active later"],
    icon: LoaderCircleIcon,
  },
];

export const getStatusColor = (status?: string) => {
  if (!status) return colors._blue2; // Default color

  for (const { color, statuses } of STATUS_COLOR) {
    if (statuses.includes(status.toLowerCase())) {
      return color;
    }
  }
  return colors._blue2; // Default color
};

export const getStatusIcon = (status?: string) => {
  if (!status) return LoaderCircleIcon; // Default icon

  for (const { icon, statuses } of STATUS_COLOR) {
    if (statuses.includes(status.toLowerCase())) {
      return icon;
    }
  }
  return LoaderCircleIcon; // Default icon
}
