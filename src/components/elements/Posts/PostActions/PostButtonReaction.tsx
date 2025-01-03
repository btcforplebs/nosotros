import { IconButton } from '@/components/ui/IconButton/IconButton'
import { useRootContext } from '@/hooks/useRootStore'
import type { Note } from '@/stores/notes/note'
import { fallbackEmoji, reactionStore } from '@/stores/reactions/reactions.store'
import { colors } from '@stylexjs/open-props/lib/colors.stylex'
import { IconHeart, IconHeartFilled } from '@tabler/icons-react'
import { AnimatePresence, motion } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import { css, html } from 'react-strict-dom'
import { ReactionPicker } from '../../Reactions/ReactionPicker'
import { ReactionsTooltip } from '../../Reactions/ReactionsTooltip'
import { ButtonContainer } from './PostButtonContainer'
import { iconProps } from './utils'

type Props = {
  note: Note
  dense?: boolean
}

// Only known emojis
const emojiColors: Record<string, string> = {
  '❤️': colors.red7,
  '🚀': colors.orange9,
  '👍': colors.yellow7,
  '🤙': colors.yellow7,
  '😂': colors.yellow7,
  '🫡': colors.yellow7,
  '😮': colors.yellow7,
  '😭': colors.yellow7,
  '😡': colors.orange7,
}

export const ButtonReaction = observer(function PostReactions(props: Props) {
  const { note, dense } = props
  const total = reactionStore.getTotal(note.id)
  const pubkey = useRootContext().pubkey
  const myReaction = fallbackEmoji(reactionStore.getByNoteIdAndPubkey(note.id, pubkey)?.[0])
  const color = myReaction ? emojiColors[myReaction] || colors.red7 : colors.red7
  const context = useRootContext()
  return (
    <>
      <ButtonContainer
        active={!!myReaction}
        dense={dense}
        value={
          !!total && (
            <ReactionsTooltip noteId={note.id}>
              <span>{total || ''}</span>
            </ReactionsTooltip>
          )
        }>
        <ReactionPicker onClick={(reaction) => note.react(context.client, reaction)}>
          <span>
            <AnimatePresence initial={false}>
              <IconButton
                size={dense ? 'sm' : 'md'}
                selected={!!myReaction}
                onClick={() => note.react(context.client, '❤️')}
                sx={[(color && styles[`button$${color}`]) || styles.button$red]}
                selectedIcon={
                  <motion.div
                    key='myreaction'
                    style={{ color }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 10 }}>
                    {myReaction === '❤️' ? (
                      <IconHeartFilled
                        size={dense ? iconProps.size$dense : iconProps.size}
                        strokeWidth={iconProps.strokeWidth}
                      />
                    ) : (
                      <html.span style={styles.myCustomReaction}>{myReaction}</html.span>
                    )}
                  </motion.div>
                }
                icon={
                  <motion.div
                    key={'reaction'}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                    whileTap={{ color: colors.red7, scale: 0.9 }}>
                    <IconHeart
                      size={dense ? iconProps.size$dense : iconProps.size}
                      strokeWidth={iconProps.strokeWidth}
                    />
                  </motion.div>
                }
              />
            </AnimatePresence>
          </span>
        </ReactionPicker>
      </ButtonContainer>
    </>
  )
})

const styles = css.create({
  [colors.red7]: { color: colors.red7 },
  [colors.yellow7]: { color: colors.yellow7 },
  [colors.orange7]: { color: colors.orange7 },
  [colors.orange9]: { color: colors.orange9 },
  myCustomReaction: {
    fontSize: '130%',
  },
})
