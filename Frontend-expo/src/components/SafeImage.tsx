import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { getImageUrl } from '../services/api';

interface SafeImageProps {
  imagePath?: string | null;
  style: any;
  placeholderText?: string;
  contentFit?: any;
}

const SafeImage: React.FC<SafeImageProps> = ({
  imagePath,
  style,
  placeholderText = 'Нет изображения',
  contentFit = 'cover',
}) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = getImageUrl(imagePath);

  if (!imageUrl || imageError) {
    return (
      <View style={[style, styles.placeholder]}>
        <Text style={styles.placeholderText}>{placeholderText}</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: imageUrl }}
      style={style}
      contentFit={contentFit}
      onError={() => setImageError(true)}
    />
  );
};

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#9E9E9E',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default SafeImage; 