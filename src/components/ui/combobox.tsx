"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

type ComboboxOption = {
    value: string;
    label: string;
};

type ComboboxProps = {
    options: ComboboxOption[];
    value: string;
    onChange: (value: string) => void;
    onInputChange?: (value: string) => void;
    placeholder?: string;
    createOption?: boolean;
    inputValue?: string;
    disabled?: boolean;
};

export function Combobox({
    options,
    value,
    onChange,
    onInputChange,
    placeholder = "Seleccionar opción...",
    createOption = false,
    inputValue = "",
    disabled = false,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState(inputValue);

    React.useEffect(() => {
        // Actualizar searchValue cuando inputValue cambia desde afuera
        setSearchValue(inputValue);
    }, [inputValue]);

    const selectedLabel = React.useMemo(() => {
        const selected = options.find((option) => option.value === value);
        return selected?.label || searchValue || "";
    }, [options, value, searchValue]);

    const handleInputChange = (input: string) => {
        setSearchValue(input);
        if (onInputChange) {
            onInputChange(input);
        }
    };

    const handleSelect = (currentValue: string) => {
        onChange(currentValue);
        setOpen(false);
    };

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase())
    );

    const shouldShowCreateOption =
        createOption &&
        searchValue.trim() !== "" &&
        !filteredOptions.some(
            (option) => option.label.toLowerCase() === searchValue.toLowerCase()
        );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {selectedLabel || placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput
                        placeholder={placeholder}
                        value={searchValue}
                        onValueChange={handleInputChange}
                    />
                    <CommandEmpty>
                        {shouldShowCreateOption ? (
                            <div
                                className="px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                onClick={() => {
                                    if (onInputChange) {
                                        onInputChange(searchValue);
                                    }
                                    setOpen(false);
                                }}
                            >
                                Crear &quot;{searchValue}&quot;
                            </div>
                        ) : (
                            "No hay resultados."
                        )}
                    </CommandEmpty>
                    <CommandGroup>
                        {filteredOptions.map((option) => (
                            <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={() => handleSelect(option.value)}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === option.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {option.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}