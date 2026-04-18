// src/components/wishes/WishForm.tsx
// Multi-step form: Thông tin → RSVP → Lời chúc → Thành công

'use client'

import { useState, useCallback } from 'react'
import type { WishFormData, Relationship } from '@/types/wishes'
import { RELATIONSHIP_LABELS } from '@/types/wishes'

interface WishFormProps {
    onSuccess?: () => void
}

type Step = 'info' | 'rsvp' | 'message' | 'success'

const STEPS: Step[] = ['info', 'rsvp', 'message', 'success']

const INITIAL_FORM: WishFormData = {
    name: '',
    email: '',
    phone: '',
    relationship: 'friend',
    attending: true,
    guest_count: 1,
    message: '',
}

export function WishForm({ onSuccess }: WishFormProps) {
    const [step, setStep] = useState<Step>('info')
    const [form, setForm] = useState<WishFormData>(INITIAL_FORM)
    const [errors, setErrors] = useState<Partial<WishFormData>>({})
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState('')

    const stepIndex = STEPS.indexOf(step)

    const update = useCallback(<K extends keyof WishFormData>(
        key: K, value: WishFormData[K]
    ) => {
        setForm((f) => ({ ...f, [key]: value }))
        setErrors((e) => ({ ...e, [key]: undefined }))
    }, [])

    // ── Validation per step ──
    const validateStep = (): boolean => {
        const newErrors: Partial<Record<keyof WishFormData, string>> = {}

        if (step === 'info') {
            if (!form.name.trim()) newErrors.name = 'Vui lòng nhập tên'
            if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                newErrors.email = 'Email không hợp lệ'
        }

        if (step === 'message') {
            if (!form.message.trim()) newErrors.message = 'Vui lòng nhập lời chúc'
            if (form.message.length > 500)
                newErrors.message = `Lời chúc quá dài (${form.message.length}/500 ký tự)`
        }

        setErrors(newErrors as any)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = useCallback(async () => {
        if (!validateStep()) return

        if (step === 'message') {
            // Submit
            setLoading(true)
            setApiError('')
            try {
                const res = await fetch('/api/wishes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form),
                })
                const json = await res.json()
                if (!res.ok) throw new Error(json.error ?? 'Lỗi không xác định')
                setStep('success')
                onSuccess?.()
            } catch (err: any) {
                setApiError(err.message ?? 'Không thể gửi. Vui lòng thử lại.')
            } finally {
                setLoading(false)
            }
            return
        }

        const next = STEPS[stepIndex + 1]
        if (next) setStep(next)
    }, [step, stepIndex, form, validateStep, onSuccess])

    const handleBack = useCallback(() => {
        const prev = STEPS[stepIndex - 1]
        if (prev) setStep(prev)
    }, [stepIndex])

    // ── Render ──
    if (step === 'success') return <SuccessScreen form={form} />

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Progress bar */}
            <StepProgress current={stepIndex} total={3} />

            <div className="mt-6 space-y-4">
                {step === 'info' && <StepInfo form={form} errors={errors} update={update} />}
                {step === 'rsvp' && <StepRSVP form={form} errors={errors} update={update} />}
                {step === 'message' && <StepMessage form={form} errors={errors} update={update} />}
            </div>

            {apiError && (
                <p className="mt-3 text-sm text-red-500 text-center">{apiError}</p>
            )}

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
                {stepIndex > 0 && (
                    <button
                        onClick={handleBack}
                        className="flex-1 py-3 rounded-xl text-sm border border-neutral-200
              dark:border-neutral-700 text-neutral-600 dark:text-neutral-400
              hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                        Quay lại
                    </button>
                )}
                <button
                    onClick={handleNext}
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl text-sm font-medium
            bg-rose-500 hover:bg-rose-600 text-white
            disabled:opacity-60 disabled:cursor-not-allowed
            transition-colors flex items-center justify-center gap-2"
                >
                    {loading && <MiniSpinner />}
                    {step === 'message' ? '💌 Gửi lời chúc' : 'Tiếp tục'}
                </button>
            </div>
        </div>
    )
}

// ── Step components ────────────────────────────────────────────

function StepProgress({ current, total }: { current: number; total: number }) {
    return (
        <div className="flex items-center gap-2">
            {Array.from({ length: total }).map((_, i) => (
                <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700">
                    <div
                        className="h-full bg-rose-400 transition-all duration-300"
                        style={{ width: i < current ? '100%' : i === current ? '60%' : '0%' }}
                    />
                </div>
            ))}
            <span className="text-xs text-neutral-400 flex-shrink-0">
                {current + 1}/{total}
            </span>
        </div>
    )
}

function FieldError({ msg }: { msg?: string }) {
    if (!msg) return null
    return <p className="text-xs text-red-500 mt-1">{msg}</p>
}

const inputClass = `w-full px-4 py-3 rounded-xl text-sm
  border border-neutral-200 dark:border-neutral-700
  bg-white dark:bg-neutral-900
  text-neutral-900 dark:text-neutral-100
  placeholder-neutral-400
  focus:outline-none focus:ring-2 focus:ring-rose-300
  transition-shadow`

interface StepProps {
    form: WishFormData
    errors: Partial<WishFormData>
    update: <K extends keyof WishFormData>(k: K, v: WishFormData[K]) => void
}

function StepInfo({ form, errors, update }: StepProps) {
    return (
        <>
            <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wide">
                    Tên của bạn *
                </label>
                <input
                    className={inputClass}
                    placeholder="Nguyễn Văn A"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                />
                <FieldError msg={errors.name as string} />
            </div>

            <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wide">
                    Email (tùy chọn)
                </label>
                <input
                    className={inputClass}
                    placeholder="email@example.com"
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                />
                <FieldError msg={errors.email as string} />
            </div>

            <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wide">
                    Bạn là
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(RELATIONSHIP_LABELS) as Relationship[]).map((rel) => (
                        <button
                            key={rel}
                            onClick={() => update('relationship', rel)}
                            className={[
                                'py-2.5 px-3 rounded-xl text-xs font-medium border transition-all',
                                form.relationship === rel
                                    ? 'bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-950 dark:border-rose-700 dark:text-rose-400'
                                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300',
                            ].join(' ')}
                        >
                            {RELATIONSHIP_LABELS[rel]}
                        </button>
                    ))}
                </div>
            </div>
        </>
    )
}

function StepRSVP({ form, errors, update }: StepProps) {
    return (
        <>
            <div>
                <label className="block text-xs font-medium text-neutral-500 mb-3 uppercase tracking-wide">
                    Bạn có tham dự không?
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { val: true, emoji: '🎉', label: 'Vui lòng tham dự' },
                        { val: false, emoji: '😢', label: 'Tiếc là vắng mặt' },
                    ].map(({ val, emoji, label }) => (
                        <button
                            key={String(val)}
                            onClick={() => update('attending', val)}
                            className={[
                                'py-4 rounded-xl text-sm font-medium border transition-all text-center',
                                form.attending === val
                                    ? val
                                        ? 'bg-green-50 border-green-300 text-green-700 dark:bg-green-950 dark:border-green-700 dark:text-green-400'
                                        : 'bg-neutral-100 border-neutral-300 text-neutral-600 dark:bg-neutral-800'
                                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-neutral-300',
                            ].join(' ')}
                        >
                            <div className="text-xl mb-1">{emoji}</div>
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {form.attending && (
                <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wide">
                        Số người tham dự
                    </label>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => update('guest_count', Math.max(1, form.guest_count - 1))}
                            className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-700
                flex items-center justify-center text-lg text-neutral-600 hover:bg-neutral-50"
                        >−</button>
                        <span className="text-2xl font-medium text-neutral-900 dark:text-neutral-100 w-8 text-center">
                            {form.guest_count}
                        </span>
                        <button
                            onClick={() => update('guest_count', Math.min(10, form.guest_count + 1))}
                            className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-700
                flex items-center justify-center text-lg text-neutral-600 hover:bg-neutral-50"
                        >+</button>
                        <span className="text-sm text-neutral-400">người</span>
                    </div>
                </div>
            )}
        </>
    )
}

function StepMessage({ form, errors, update }: StepProps) {
    const remaining = 500 - form.message.length

    return (
        <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wide">
                Lời chúc của bạn *
            </label>
            <textarea
                className={`${inputClass} resize-none`}
                rows={5}
                placeholder="Chúc hai bạn trăm năm hạnh phúc, mãi yêu thương nhau..."
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
                maxLength={500}
            />
            <div className="flex justify-between mt-1">
                <FieldError msg={errors.message as string} />
                <span className={`text-xs ml-auto ${remaining < 50 ? 'text-amber-500' : 'text-neutral-400'}`}>
                    {remaining} ký tự còn lại
                </span>
            </div>

            {/* Quick phrases */}
            <div className="mt-3">
                <p className="text-xs text-neutral-400 mb-2">Gợi ý nhanh:</p>
                <div className="flex flex-wrap gap-1.5">
                    {[
                        'Chúc hai bạn trăm năm hạnh phúc!',
                        'Mãi yêu thương nhau nhé!',
                        'Sớm có tin vui! 🌸',
                        'Hạnh phúc dài lâu ❤️',
                    ].map((phrase) => (
                        <button
                            key={phrase}
                            onClick={() => update('message', form.message ? `${form.message} ${phrase}` : phrase)}
                            className="text-xs px-3 py-1.5 rounded-full border border-neutral-200
                dark:border-neutral-700 text-neutral-500 hover:border-rose-300
                hover:text-rose-500 transition-colors"
                        >
                            {phrase}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

function SuccessScreen({ form }: { form: WishFormData }) {
    return (
        <div className="text-center py-8 animate-fade-in">
            {/* Confetti animation (CSS only) */}
            <div className="text-5xl mb-4 animate-bounce-once">🎉</div>
            <h3 className="text-xl font-serif text-neutral-900 dark:text-neutral-100 mb-2">
                Cảm ơn {form.name}!
            </h3>
            <p className="text-sm text-neutral-500 max-w-xs mx-auto">
                Lời chúc của bạn đã được gửi đến Janes & Henry.
                {form.attending
                    ? ` Chúng tôi rất vui khi được gặp bạn vào ngày 06/12/2026! 🌸`
                    : ' Rất tiếc khi bạn không thể tham dự. Cảm ơn bạn đã nhớ đến chúng tôi!'}
            </p>
            <div className="mt-6 flex justify-center gap-3">
                <button
                    onClick={() => {
                        if (navigator.share) {
                            navigator.share({
                                title: 'Đám cưới Janes & Henry',
                                text: 'Tôi vừa gửi lời chúc đến Janes & Henry! Cùng chúc mừng họ nhé 🎊',
                                url: window.location.href,
                            })
                        }
                    }}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium
            bg-rose-500 hover:bg-rose-600 text-white transition-colors"
                >
                    Chia sẻ thiệp
                </button>
            </div>
        </div>
    )
}

function MiniSpinner() {
    return (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    )
}
