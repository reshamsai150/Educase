import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <View style={styles.badgeDot} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction ? (
        <TouchableOpacity
          onPress={onAction}
          style={styles.button}
          activeOpacity={0.85}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EFE4D4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  badgeDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#1F6B5C',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1D2A24',
    textAlign: 'center',
  },
  description: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: '#6D685F',
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#1F6B5C',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
