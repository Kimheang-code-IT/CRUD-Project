/**
 * Menu routes — re-export from OOP constants for backward compatibility.
 */
import { MenuConstants, type IMenuRoute } from './MenuConstants'

export type { IMenuRoute as MenuRoute }
export const all = MenuConstants.ROUTES
