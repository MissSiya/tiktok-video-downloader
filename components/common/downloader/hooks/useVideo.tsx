import { useState } from 'react';
import { DownloaderService } from '../services/downloader.service';
import { DownloadedData } from '../types/downloader.type';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';

export function useVideo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  const [data, setData] = useState<DownloadedData>();

  const params = useParams();

  const { t } = useTranslation(params.lng);

  const video = async (url: string) => {
    setLoading(true);

    try {
      const [withoutWatermark, withWatermark, audio] = await Promise.all([
        DownloaderService.catchVideo({ url, isNoTTWatermark: true }),
        DownloaderService.catchVideo({ url }),
        DownloaderService.catchVideo({ url, isAudioOnly: true }),
      ]);

      const newData: DownloadedData = {
        withoutWatermark: { ...withoutWatermark },
        withWatermark: { ...withWatermark },
        audio: { ...audio },
      };

      setData(newData);
    } catch (error) {
      // @ts-ignore
      if (error?.response?.data?.status === 'error') {
        setError(t('video-not-found'));
      } else {
        setError(error);
      }
    }

    setLoading(false);
  };

  return { loading, error, video, data };
}