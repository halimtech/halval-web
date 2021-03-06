import React, { InputHTMLAttributes } from 'react'
import { useField } from 'formik'
import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';



type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    name: string;
    textarea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({
    label,
    size: _,
    ...props }) => {

    const [field, { error }] = useField(props);
    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <Input {...field} {...props}
                placeholder={props.placeholder}
                id={field.name} />
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    )
}