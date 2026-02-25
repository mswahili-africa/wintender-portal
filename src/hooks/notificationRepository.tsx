import { getContacts, getWhatsappMessages } from "@/services/notificationServices";
import { useQuery } from "@tanstack/react-query";
interface IQueryParams {
  page: number;
  size?: number;
  sort?: string;
  search?: string;
  filter?: Record<string, any>;
  userId?: string;
  category?: string;
  phoneNumber?: string;
}


export function useWhatsappContacts(props: IQueryParams, options?: { enabled?: boolean }) {
  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ["getWhatsappContacts", props.page, props.sort, props?.search, props?.filter, props?.phoneNumber],
    queryFn: () =>
      getContacts({
        page: props.page,
        size: props.size ?? 10,
        sort: props.sort,
        search: props.search,
        phoneNumber: props.phoneNumber,
        ...props.filter,
      }),
    refetchInterval: 300000, // 5 minutes
    enabled: options?.enabled ?? true,
    refetchOnWindowFocus: false,
    staleTime: 1 * 60 * 1000,
  });

  return { isLoading, isError, contacts: data, refetch };
}

export function useWhatsappMessages(props: IQueryParams, options?: { enabled?: boolean }) {
  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ["getWhatsappMessages", props.page, props.sort, props?.search, props?.filter, props?.phoneNumber],
    queryFn: () =>
      getWhatsappMessages({
        page: props.page,
        size: props.size ?? 5,
        sort: props.sort,
        search: props.search,
        phoneNumber: props.phoneNumber,
        ...props.filter,
      }),
    refetchInterval: 120000, // 2 minutes
    refetchOnWindowFocus: false,
    enabled: options?.enabled ?? true,
    staleTime: 1 * 60 * 1000,
  });

  return { isLoading, isError, messages: data, refetch };
}
