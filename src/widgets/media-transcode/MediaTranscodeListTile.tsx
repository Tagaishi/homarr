import { Card, Group, Progress, ScrollArea, Stack, Text } from "@mantine/core";
import { IconHeartbeat, IconTransform } from "@tabler/icons-react";
import { useConfigContext } from "~/config/provider";
import { api } from "~/utils/api";
import { defineWidget } from "../helper";
import { WidgetLoading } from "../loading";
import { IWidget } from "../widgets";
import { MediaTranscodeWorker } from "./media-transcode-types";

const definition = defineWidget({
  id: 'media-transcode-list',
  icon: IconTransform,
  options: {

  },
  gridstack: {
    minWidth: 2,
    minHeight: 2,
    maxWidth: 12,
    maxHeight: 12,
  },
  component: MediaTranscodeListTile,
})

export type MediaTranscodeListWidget = IWidget<(typeof definition)['id'], typeof definition>;

interface MediaTranscodeListWidgetProps {
  widget: MediaTranscodeListWidget;
}

function MediaTranscodeListTile({ widget }: MediaTranscodeListWidgetProps) {
  const { name: configName } = useConfigContext();
  const { data: status, isLoading: isStatusLoading } = api.mediaTranscode.status.useQuery({ configName: configName! })
  const { data: workers, isLoading: areWorkersLoading } = api.mediaTranscode.workers.useQuery({ configName: configName! },{ refetchInterval: 3000 })

  if (!status || isStatusLoading || areWorkersLoading) {
    return <WidgetLoading />
  }

  console.log(status);
  console.log(workers);

  return (
    <Stack h="100%" align="center" spacing="sm">
      <Text>{`Total Files: ${status.TotalFileCount}`}</Text>
      <Group display="flex" w="100%">
        <Card display="flex" style={{ flex: 1 }} padding="xs" radius="md" withBorder>
          <Stack style={{ flex: 1 }} spacing={0} align="center">
            <IconTransform />
            <Text>Transcodings</Text>
            <Group display="flex" w="100%">
              <Stack style={{ flex: 1 }} spacing={0} align="center">
                <Text>Failed</Text>
                <Text color="red">{status.FailedTranscodeCount}</Text>
              </Stack>
              <Stack style={{ flex: 1 }} spacing={0} align="center">
                <Text>Total</Text>
                <Text color="green">{status.TotalTranscodes}</Text>
              </Stack>
            </Group>
          </Stack>
        </Card>
        <Card display="flex" style={{ flex: 1 }} padding="xs" radius="md" withBorder>
          <Stack style={{ flex: 1 }} spacing={0} align="center">
            <IconHeartbeat />
            <Text>Health Checks</Text>
            <Group display="flex" w="100%">
              <Stack style={{ flex: 1 }} spacing={0} align="center">
                <Text>Failed</Text>
                <Text color="red">{status.FailedHealthCheckCount}</Text>
              </Stack>
              <Stack style={{ flex: 1 }} spacing={0} align="center">
                <Text>Total</Text>
                <Text color="green">{status.TotalHealthChecks}</Text>
              </Stack>
            </Group>
          </Stack>
        </Card>
      </Group>
      <ScrollArea>
        {workers.map((worker: MediaTranscodeWorker) => {
          return (
            <Stack key={worker.id} spacing={0}>
              <Text lineClamp={1}>{worker.file}</Text>
              <Group display="flex">
                <Text>{worker.step}</Text>
                <Progress value={worker.percentage} style={{ flex: 1 }}/>
                <Text>{`${worker.percentage}%`}</Text>
              </Group>
            </Stack>
          )
        })}
      </ScrollArea>
    </Stack>
  )
}

export default definition;