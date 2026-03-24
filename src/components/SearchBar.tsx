import React, {useCallback, useRef} from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
  onClear: () => void;
  onSubmit?: () => void;
};

export default function SearchBar({
  value,
  onChangeText,
  onClear,
  onSubmit,
}: SearchBarProps) {
  const inputRef = useRef<TextInput>(null);

  const handleClear = useCallback(() => {
    onChangeText('');
    onClear();
    inputRef.current?.focus();
  }, [onChangeText, onClear]);

  return (
    <View style={styles.shell}>
      <View style={styles.inputWrap}>
        <Text style={styles.searchLabel}>Search</Text>
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder="Search products"
          placeholderTextColor="#8A857C"
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          selectionColor="#1F6B5C"
          cursorColor="#1F6B5C"
          returnKeyType="search"
          blurOnSubmit={false}
          underlineColorAndroid="transparent"
          onSubmitEditing={() => {
            Keyboard.dismiss();
            onSubmit?.();
          }}
        />
        {value ? (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
            activeOpacity={0.8}>
            <Text style={styles.clearText}>X</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: '#F4F1EA',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },
  inputWrap: {
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: '#FFFCF7',
    paddingLeft: 14,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#7C6F5D',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 4,
  },
  searchLabel: {
    color: '#1F6B5C',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#1D2A24',
    fontSize: 16,
    paddingVertical: 12,
    minHeight: 52,
  },
  clearButton: {
    marginLeft: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFE7DA',
  },
  clearText: {
    color: '#655E56',
    fontWeight: '700',
  },
});
