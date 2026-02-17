import type { IEntity } from '~/types/entities'

/**
 * Abstract base repository for CRUD operations (OOP).
 * Subclasses implement loadSource() to provide initial data.
 */
export abstract class BaseRepository<T extends IEntity> {
  protected abstract loadSource(): Promise<T[]>

  async load(): Promise<T[]> {
    const data = await this.loadSource()
    return data.map((x) => ({ ...x } as T))
  }

  add(items: T[], item: Omit<T, 'id'>): T[] {
    const id = String(Date.now())
    const newItem = { ...item, id } as T
    return [...items, newItem]
  }

  update(items: T[], id: string, patch: Partial<Omit<T, 'id'>>): T[] {
    const index = items.findIndex((x) => x.id === id)
    if (index === -1) return items
    const current = items[index]!
    const filtered = Object.fromEntries(
      Object.entries(patch as object).filter(([, v]) => v !== undefined)
    ) as Partial<Omit<T, 'id'>>
    const updated = { ...current, ...filtered, id: current.id } as T
    const next = [...items]
    next[index] = updated
    return next
  }

  remove(items: T[], id: string): T[] {
    return items.filter((x) => x.id !== id)
  }

  removeMany(items: T[], ids: string[]): T[] {
    return items.filter((x) => !ids.includes(x.id))
  }
}
