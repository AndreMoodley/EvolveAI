import { useCallback, useContext, useState } from 'react';
import { Platform, Share, Linking } from 'react-native';
import { AuthContext } from '../store/auth-context';
import { renderCinematic } from '../util/http';

export function useCinematic() {
  const { token } = useContext(AuthContext);
  const [renderingId, setRenderingId] = useState(null);
  const [error, setError] = useState(null);

  const render = useCallback(
    async (compositionId, inputProps = {}) => {
      if (!token) throw new Error('Not authenticated');
      setRenderingId(compositionId);
      setError(null);
      try {
        const result = await renderCinematic(compositionId, inputProps, token);
        return result;
      } catch (e) {
        setError(e.message ?? 'Render failed');
        throw e;
      } finally {
        setRenderingId(null);
      }
    },
    [token],
  );

  const renderAndShare = useCallback(
    async (compositionId, inputProps = {}, shareMessage) => {
      const result = await render(compositionId, inputProps);
      if (Platform.OS === 'web') {
        await Linking.openURL(result.fullUrl);
      } else {
        await Share.share({ url: result.fullUrl, message: shareMessage ?? '' });
      }
      return result;
    },
    [render],
  );

  return { render, renderAndShare, renderingId, error };
}
