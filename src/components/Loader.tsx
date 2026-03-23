import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';

type LoaderProps = {
  count?: number;
};

export default function Loader({count = 6}: LoaderProps) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 950,
        useNativeDriver: true,
      }),
    ).start();
  }, [shimmer]);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-220, 220],
  });

  return (
    <View style={styles.container}>
      {Array.from({length: count}).map((_, index) => (
        <View
          key={index}
          style={styles.card}>
          <View style={styles.imageBlock}>
            <Animated.View
              style={[
                styles.shimmer,
                {
                  transform: [{translateX}],
                },
              ]}
            />
          </View>
          <View style={styles.content}>
            <View style={[styles.line, styles.titleLine]} />
            <View style={[styles.line, styles.subtitleLine]} />
            <View style={styles.row}>
              <View style={[styles.line, styles.priceLine]} />
              <View style={[styles.line, styles.ratingLine]} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFCF7',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    overflow: 'hidden',
  },
  imageBlock: {
    width: 104,
    height: 104,
    borderRadius: 16,
    backgroundColor: '#E7DED0',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    marginLeft: 14,
  },
  line: {
    height: 12,
    borderRadius: 999,
    backgroundColor: '#E7DED0',
    overflow: 'hidden',
  },
  titleLine: {
    width: '80%',
    height: 16,
    marginBottom: 10,
  },
  subtitleLine: {
    width: '58%',
    marginBottom: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceLine: {
    width: 72,
    height: 14,
  },
  ratingLine: {
    width: 56,
    height: 14,
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    width: '40%',
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
});
