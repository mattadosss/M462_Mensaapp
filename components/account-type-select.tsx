import { AccountType } from "@/types/user";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AccountTypeSelectProps {
    value?: AccountType;
    onChange?: (value: AccountType) => void;
    name?: string;
    required?: boolean;
}

export function AccountTypeSelect({
    value,
    onChange,
    name = "accountType",
    required = true,
}: AccountTypeSelectProps) {
    return (
        <Select
            name={name}
            value={value}
            onValueChange={onChange}
            required={required}
        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Student">Student</SelectItem>
                <SelectItem value="Teacher">Teacher</SelectItem>
                <SelectItem value="External">External</SelectItem>
            </SelectContent>
        </Select>
    );
} 