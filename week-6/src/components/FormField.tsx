// COMO: Componente reutilizable que combina Controller de RHF, TextInput y mensaje de error Zod
// PARA: Encapsular la integración Controller + TextInput en un solo componente genérico
// IMPACTO: CreateScreen y EditScreen usan el mismo FormField; un cambio de estilo afecta ambas

import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';

// COMO: Props genéricas con restricciones de tipo para que FormField sea type-safe
// PARA: TypeScript valida que name corresponda a un campo real del schema del formulario
// IMPACTO: Pasar un nombre de campo inexistente da error en compilación, no en runtime
interface FormFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

export function FormField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
}: FormFieldProps<TFieldValues>): React.JSX.Element {
  return (
    // COMO: Controller conecta el TextInput al estado de React Hook Form via render prop
    // PARA: RHF controla el valor, onChange y onBlur sin necesidad de useState manual
    // IMPACTO: El formulario es "controlled" por RHF; Zod valida en cada cambio según mode
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={[
              styles.input,
              multiline && styles.inputMultiline,
              // COMO: Aplica borde rojo si hay error de validación en este campo
              // PARA: Feedback visual inmediato que indica qué campo necesita corrección
              // IMPACTO: El usuario identifica el problema sin leer el mensaje de error
              error && styles.inputError,
            ]}
            value={value !== undefined ? String(value) : ''}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor={COLORS.textSecondary}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            multiline={multiline}
            numberOfLines={numberOfLines}
            autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
          />
          {/* COMO: Renderiza el mensaje de error solo si fieldState.error existe
              PARA: Mostrar la regla Zod que falló junto al campo correspondiente
              IMPACTO: El usuario sabe exactamente qué corregir sin submit adicional */}
          {error && (
            <Text style={styles.errorText}>{error.message}</Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.xs,
  },
  label: {
    ...TYPOGRAPHY.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    color: COLORS.text,
    fontSize: 15,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorBg,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    fontWeight: '500',
  },
});
