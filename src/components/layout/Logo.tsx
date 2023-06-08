import { Group, Image, Text } from '@mantine/core';
import { useConfigContext } from '../../config/provider';
import { usePrimaryGradient } from './useGradient';
import { useDashboard } from '~/pages';

interface LogoProps {
  size?: 'md' | 'xs';
  withoutText?: boolean;
}

export function Logo({ size = 'md', withoutText = false }: LogoProps) {
  const { config } = useConfigContext();
  const dashboard = useDashboard();
  const primaryGradient = usePrimaryGradient();

  return (
    <Group spacing={size === 'md' ? 'xs' : 4} noWrap>
      <Image
        width={size === 'md' ? 50 : 12}
        src={dashboard.logoSource || '/imgs/logo/logo-color.svg'}
        alt="Homarr Logo"
        className="dashboard-header-logo-image"
      />
      {withoutText ? null : (
        <Text
          size={size === 'md' ? 22 : 10}
          weight="bold"
          variant="gradient"
          className="dashboard-header-logo-text"
          gradient={primaryGradient}
        >
          {dashboard.pageTitle || 'Homarr'}
        </Text>
      )}
    </Group>
  );
}
