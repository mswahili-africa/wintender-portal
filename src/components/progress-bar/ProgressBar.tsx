
export const ProgressBar = ({ completedSteps, steps }: { completedSteps: number[], steps: string[] }) => {
    return (
        <div className="w-full overflow-hidden bg-gray-200 h-4 sm:h-8 rounded-full dark:bg-gray-200 my-3">
            <div className="bg-green-600 h-4 sm:h-8 min-w-fit text-xs font-medium text-white text-center p-0.5 duration-500 leading-none rounded-full flex items-center justify-center" style={{ width: (completedSteps.length) / steps.length * 100 + "%" }}> {(completedSteps.length) / steps.length * 100}%</div>
        </div>
    )
}
