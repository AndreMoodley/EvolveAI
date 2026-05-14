import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In production, send to Sentry here
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <View style={styles.container}>
        <Text style={styles.sigil}>⟁</Text>
        <Text style={styles.title}>The Void rejected this signal.</Text>
        <Text style={styles.message}>
          {this.state.error?.message ?? 'An unexpected error occurred.'}
        </Text>
        <Pressable style={styles.button} onPress={this.handleReset}>
          <Text style={styles.buttonText}>Return to Void</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  sigil: {
    fontSize: 48,
    color: '#4a4a6a',
    marginBottom: 16,
  },
  title: {
    color: '#c0b8d0',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    color: '#6a6a8a',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#1e1e2e',
    borderWidth: 1,
    borderColor: '#3a3a5a',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#c0b8d0',
    fontSize: 14,
    fontWeight: '500',
  },
});
