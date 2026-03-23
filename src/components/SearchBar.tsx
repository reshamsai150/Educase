import React from 'react';
import {
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
};

export default function SearchBar({
  value,
  onChangeText,
  onClear,
}: SearchBarProps) {
  return (
    <View style={styles.shell}>
      <View style={styles.inputWrap}>
        <Text style={styles.icon}>Search</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search products"
          placeholderTextColor="#8A857C"
          style={styles.input}
          autoCorrect={false}
          returnKeyType="search"
        />
        {value ? (
          <TouchableOpacity
            onPress={onClear}
            style={styles.clearButton}
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
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: '#FFFCF7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    shadowColor: '#7C6F5D',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 4,
  },
  icon: {
    color: '#1F6B5C',
    fontSize: 12,
    fontWeight: '700',
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#1D2A24',
    fontSize: 16,
    paddingVertical: 12,
  },
  clearButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFE7DA',
  },
  clearText: {
    color: '#655E56',
    fontWeight: '700',
  },
});
