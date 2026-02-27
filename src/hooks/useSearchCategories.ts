import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getCategories } from "@/services/tenders";
import useErrorHandler from "./useErrorHandler";

interface IProps {
    page: number
    size: number
    search?: string
    categories?: string[]
    sort?: string
    filter?: Record<string, any>
}

