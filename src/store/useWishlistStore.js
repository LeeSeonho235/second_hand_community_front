import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { likePost, unlikePost } from '../api/likes'

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      postIds: [],

      isWished: (postId) => get().postIds.includes(postId),

      toggle: async (postId) => {
        const wished = get().postIds.includes(postId)
        if (wished) {
          await unlikePost(postId)
          set({ postIds: get().postIds.filter((id) => id !== postId) })
        } else {
          await likePost(postId)
          set({ postIds: [...get().postIds, postId] })
        }
      },
    }),
    { name: 'campus-market-wishlist' },
  ),
)
