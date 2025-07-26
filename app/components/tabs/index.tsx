"use client"

import { ReactNode, Dispatch, SetStateAction } from "react"
import lodash from "lodash"
import XMarkIcon from "@/app/icons/x-mark"

export type Tab = {
    id: string
    title: string
    content: ReactNode
    closeable: boolean
}

export function Tabs(
    { tabs, setTabs, setCurrentTab, className = "", currentTab = 0 } : 
    { tabs: Tab[],  setTabs: Dispatch<SetStateAction<Tab[]>>, 
        setCurrentTab: Dispatch<SetStateAction<number>>, 
        className?: string, 
        currentTab?: number 
    }
) {
    return (
        <div className={className}>
            <div className="flex flex-row items-center gap-3 bg-gray-dark-850 rounded-t-lg p-1.5">
                {
                tabs.map((tab, index) => {
                    return (
                    <div 
                    key={tab.id} 
                    className="flex flex-row items-center gap-1 cursor-pointer bg-gray-dark-850 rounded-sm px-2 py-1 hover:bg-[rgba(255,255,255,0.1)]"
                    onClick={() => {
                        setCurrentTab(index)
                    }}>
                        <span className={"text-sm pt-[1.1px] " + (currentTab === index ? "text-white" : "text-gray")}>{tab.title}</span>
                        { 
                        tab.closeable && 
                        <div className="text-xs hover:bg-[rgba(0,0,0,0.05)] text-gray-400" onClick={
                            (e) => {
                                e.stopPropagation()
                                
                                setTabs((tabs) => {
                                    const deepCopy = lodash.cloneDeep(tabs)
                                    deepCopy.splice(index, 1)

                                    setCurrentTab((currentTab) => Math.min(currentTab, deepCopy.length - 1))
                                    
                                    return deepCopy
                                })
                            }
                        }>
                            <XMarkIcon className="size-4"/>
                        </div>
                        }
                    </div>
                    )
                })
                }
            </div>
            <div className="bg-gray-dark rounded-b-lg h-full">
                {
                    (currentTab >= 0 && currentTab < tabs.length) ? tabs[currentTab].content : ""
                }
            </div>
            </div>
    )
}