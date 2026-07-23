import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChatBubbleLeftRight, Trash, MagnifyingGlass, Spinner } from "@medusajs/icons";
import { Container, Heading, Table, Input, Button, Text, Select } from "@medusajs/ui";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { fetchAdmin } from "../../lib/client";

type Subscriber = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
};

type SubscribersResponse = {
  subscribers: Subscriber[];
  count: number;
  limit: number;
  offset: number;
};

const AdminNewsletterPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<"desc" | "asc">("desc");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery<SubscribersResponse>({
    queryKey: ["newsletter-subscribers", search, order],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("q", search);
      params.append("order", order);
      return fetchAdmin<SubscribersResponse>(`/admin/newsletter?${params.toString()}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      setDeletingId(id);
      return fetchAdmin(`/admin/newsletter/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsletter-subscribers"] });
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleDelete = (id: string, email: string) => {
    if (window.confirm(`Are you sure you want to remove ${email} from subscribers?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h1">Newsletter Subscribers</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Manage your subscribed users and email newsletter list
          </Text>
        </div>
        {data && (
          <Text size="small" weight="plus" className="text-ui-fg-subtle">
            Total: {data.count}
          </Text>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <div className="relative w-72">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-ui-fg-muted h-4 w-4" />
          <Input
            size="small"
            placeholder="Search email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Text size="small" className="text-ui-fg-subtle">Sort:</Text>
          <Select value={order} onValueChange={(val) => setOrder(val as "desc" | "asc")}>
            <Select.Trigger size="small" className="w-36">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="desc">Newest first</Select.Item>
              <Select.Item value="asc">Oldest first</Select.Item>
            </Select.Content>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Email Address</Table.HeaderCell>
              <Table.HeaderCell>Joining Date</Table.HeaderCell>
              <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading ? (
              <Table.Row>
                <Table.Cell colSpan={3} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2 text-ui-fg-subtle">
                    <Spinner className="animate-spin" />
                    <span>Loading subscribers...</span>
                  </div>
                </Table.Cell>
              </Table.Row>
            ) : isError ? (
              <Table.Row>
                <Table.Cell colSpan={3} className="h-32 text-center text-ui-fg-error">
                  Failed to load subscribers.{" "}
                  <Button size="small" variant="secondary" onClick={() => refetch()}>
                    Retry
                  </Button>
                </Table.Cell>
              </Table.Row>
            ) : data?.subscribers.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={3} className="h-32 text-center text-ui-fg-subtle">
                  No newsletter subscribers found.
                </Table.Cell>
              </Table.Row>
            ) : (
              data?.subscribers.map((subscriber) => (
                <Table.Row key={subscriber.id}>
                  <Table.Cell className="font-medium text-ui-fg-base">
                    {subscriber.email}
                  </Table.Cell>
                  <Table.Cell className="text-ui-fg-subtle">
                    {new Date(subscriber.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <Button
                      size="small"
                      variant="transparent"
                      className="text-ui-fg-subtle hover:text-ui-fg-error"
                      isLoading={deletingId === subscriber.id}
                      onClick={() => handleDelete(subscriber.id, subscriber.email)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </div>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "News Letter",
  icon: ChatBubbleLeftRight,
  rank: 1,
});

export default AdminNewsletterPage;
