import { Loader, LucideIcon } from "lucide-react-native";
import { getStatusColor, getStatusIcon } from "../../lib/status";

export const StatusIcon = ({
  status = "default",
  size = 80,
  color = getStatusColor(status),
  Icon = getStatusIcon(status),
}: {
  status?: string;
  size?: number;
  color?: string;
  Icon?: LucideIcon;
}) => {
  return <Icon size={size} color={color} />;
};
