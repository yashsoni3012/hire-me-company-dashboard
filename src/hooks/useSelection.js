import { useState, useCallback } from 'react'

export function useSelection(initialItems = []) {
    const [selectedItems, setSelectedItems] = useState(new Set())

    const toggleItem = useCallback((id) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev)
            if (newSet.has(id)) {
                newSet.delete(id)
            } else {
                newSet.add(id)
            }
            return newSet
        })
    }, [])

    const toggleAll = useCallback((items) => {
        setSelectedItems(prev => {
            const allSelected = items.every(item => prev.has(item.id))
            const newSet = new Set(prev)
            items.forEach(item => {
                if (allSelected) {
                    newSet.delete(item.id)
                } else {
                    newSet.add(item.id)
                }
            })
            return newSet
        })
    }, [])

    const clearSelection = useCallback(() => {
        setSelectedItems(new Set())
    }, [])

    const selectAll = useCallback((items) => {
        const newSet = new Set()
        items.forEach(item => newSet.add(item.id))
        setSelectedItems(newSet)
    }, [])

    const isSelected = useCallback((id) => {
        return selectedItems.has(id)
    }, [selectedItems])

    const getSelectedItems = useCallback((items) => {
        return items.filter(item => selectedItems.has(item.id))
    }, [selectedItems])

    const getSelectedCount = useCallback(() => {
        return selectedItems.size
    }, [selectedItems])

    return {
        selectedItems,
        toggleItem,
        toggleAll,
        clearSelection,
        selectAll,
        isSelected,
        getSelectedItems,
        getSelectedCount,
        setSelectedItems
    }
}