import type { NextPage } from 'next';
import Container from '@components/ui/container/container.component';
import { Typography } from '@components/ui';

type Props = {
  params: Promise<{ locale: string }>;
};

const ComponentPlayground: NextPage<Props> = async () => {
  await new Promise(resolve => setTimeout(resolve, 0)); // Await the params promise

  return (
    <Container>
      <div className="py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <Typography type="h1" size="h1" weight="bold">
              Component Playground
            </Typography>
            <Typography type="p" size="default" color="gray">
              Component showcase area - ready for new components to be added.
            </Typography>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <Typography type="h2" size="h2" weight="bold" className="mb-3">
        </div>
      </div>
    </Container>
  );
};

export default ComponentPlayground;