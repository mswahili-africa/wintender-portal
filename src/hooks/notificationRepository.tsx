import { getContacts, getMessages } from "@/services/notificationServices";
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


export function useContacts(props: IQueryParams) {
  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ["getContacts", props.page, props.sort, props?.search, props?.filter, props?.phoneNumber],
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
  });

  return { isLoading, isError, contacts: data, refetch };
}

export function useMessages(props: IQueryParams) {
  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ["getMessages", props.page, props.sort, props?.search, props?.filter, props?.phoneNumber],
    queryFn: () =>
      getMessages({
        page: props.page,
        size: props.size ?? 5,
        sort: props.sort,
        search: props.search,
        phoneNumber: props.phoneNumber,
        ...props.filter,
      }),
    refetchInterval: 300000, // 5 minutes
  });

  return { isLoading, isError, messages: data, refetch };
}
