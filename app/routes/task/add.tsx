
import { useState, useRef, useEffect } from 'react'
import { Smile, Image, Palette } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import type { EmojiClickData } from 'emoji-picker-react'
import { Compact } from '@uiw/react-color'

type Priority = 'low' | 'medium' | 'high'

export default function AddTask() {
  const [priority, setPriority] = useState<Priority>('medium')
  const [description, setDescription] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [selectedColor, setSelectedColor] = useState('')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const folders = ['Personal', 'Work', 'Shopping', 'Health'] // This could come from your data source

  // Handle ESC key to close pickers
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showEmojiPicker) setShowEmojiPicker(false)
        if (showColorPicker) setShowColorPicker(false)
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [showEmojiPicker, showColorPicker])

  return (
    <div className="p-4">
      <form className="space-y-6">
        {/* Description Textarea */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <div className="relative">
            <textarea
              ref={textareaRef}
              id="description"
              name="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full rounded-md border border-gray-300 shadow-sm p-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="What needs to be done?"
              style={{
                backgroundColor: selectedColor ? `${selectedColor}15` : undefined,
                borderColor: selectedColor ? selectedColor : undefined,
              }}
            />
          </div>

          {/* Task Enhancement Tools */}
          <div className="flex items-center gap-2 mt-2">
            {/* Emoji Picker */}
            <div className="relative" ref={emojiPickerRef}>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                title="Add emoji"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="w-5 h-5" />
              </button>
              {showEmojiPicker && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20">
                  <div className="relative bg-white rounded-lg shadow-xl max-w-[320px] w-full">
                    <button
                      type="button"
                      className="absolute right-2 top-2 z-10 p-1 rounded-full hover:bg-gray-100"
                      onClick={() => setShowEmojiPicker(false)}
                    >
                      <span className="text-gray-500 text-lg">×</span>
                    </button>
                    <EmojiPicker
                      onEmojiClick={(emojiData: EmojiClickData) => {
                        const textarea = textareaRef.current
                        if (textarea) {
                          const start = textarea.selectionStart
                          const end = textarea.selectionEnd
                          const newText = 
                            description.substring(0, start) + 
                            emojiData.emoji + 
                            description.substring(end)
                          
                          setDescription(newText)
                          
                          // Reset cursor position after React re-render
                          setTimeout(() => {
                            textarea.focus()
                            textarea.setSelectionRange(
                              start + emojiData.emoji.length,
                              start + emojiData.emoji.length
                            )
                          }, 0)
                        }
                        setShowEmojiPicker(false)
                      }}
                      width="100%"
                      height={400}
                      searchPlaceHolder="Search emoji..."
                      previewConfig={{
                        showPreview: false
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Color Picker */}
            <div className="relative">
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                title="Set color"
                onClick={(e) => {
                  e.preventDefault()
                  console.log('Color picker clicked, current state:', showColorPicker)
                  setShowColorPicker(!showColorPicker)
                }}
              >
                <Palette className="w-5 h-5" />
              </button>
              {showColorPicker && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20">
                  <div className="relative bg-white rounded-lg shadow-xl p-4">
                    <button
                      type="button"
                      className="absolute right-2 top-2 z-10 p-1 rounded-full hover:bg-gray-100"
                      onClick={() => setShowColorPicker(false)}
                    >
                      <span className="text-gray-500 text-lg">×</span>
                    </button>
                    <Compact
                      color={selectedColor || '#ff0000'}
                      onChange={(color) => {
                        console.log('Color selected:', color)
                        setSelectedColor(color.hex)
                        setShowColorPicker(false)
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Image Attachment */}
            <div className="relative">
              <input
                type="file"
                id="attachment"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    setAttachments(Array.from(e.target.files));
                  }
                }}
              />
              <label
                htmlFor="attachment"
                className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 text-gray-600 cursor-pointer"
                title="Add image"
              >
                <Image className="w-5 h-5" />
              </label>
            </div>
          </div>

          {/* Image Previews */}
          {attachments.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-200"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Attachment ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAttachments(attachments.filter((_, i) => i !== index));
                    }}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Priority Labels */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <div className="flex gap-4">
            {(['low', 'medium', 'high'] as Priority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium capitalize
                  ${priority === p
                    ? p === 'low' 
                      ? 'bg-green-100 text-green-800'
                      : p === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-600'
                  }
                `}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            className="block w-full rounded-md border border-gray-300 shadow-sm p-3 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Folder Select */}
        <div className="space-y-2">
          <label htmlFor="folder" className="block text-sm font-medium text-gray-700">
            Folder
          </label>
          <select
            id="folder"
            name="folder"
            className="block w-full rounded-md border border-gray-300 shadow-sm p-3 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select a folder</option>
            {folders.map((folder) => (
              <option key={folder} value={folder.toLowerCase()}>
                {folder}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Task
        </button>
      </form>
    </div>
  )
}
