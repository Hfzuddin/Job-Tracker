import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * A visually polished card for displaying progress with a smooth animation.
 * It's theme-adaptive, responsive, and reusable.
 *
 * @param {object} props
 * @param {React.ReactNode} props.icon - The icon to be displayed at the top of the card.
 * @param {string} props.title - The main title or goal description.
 * @param {string} props.progressLabel - The label for the progress section (e.g., "Your Progress").
 * @param {string} props.progressSubLabel - A secondary label under the progress label.
 * @param {number} props.currentValue - The current value of the progress.
 * @param {number} props.maxValue - The maximum value for the progress calculation.
 * @param {string} [props.className] - Optional additional CSS classes for custom styling.
 */
export const AnimatedProgressCard = React.forwardRef(
    (
        {
            icon,
            title,
            progressLabel,
            progressSubLabel,
            currentValue,
            maxValue,
            className,
        },
        ref
    ) => {
        // Calculate the percentage, ensuring it doesn't exceed 100%
        const percentage = maxValue > 0 ? (currentValue / maxValue) * 100 : 0;
        const clampedPercentage = Math.min(percentage, 100);

        return (
            <div
                ref={ref}
                className={cn(
                    'w-full rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 text-gray-900 dark:text-gray-100 shadow-md',
                    className
                )}
            >
                {/* Header section with icon and title */}
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30">
                        {icon}
                    </div>
                    <p className="font-medium">{title}</p>
                </div>

                {/* Progress bar section with animation */}
                <div className="my-5">
                    <div
                        className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800"
                        role="progressbar"
                        aria-valuenow={currentValue}
                        aria-valuemin={0}
                        aria-valuemax={maxValue}
                        aria-label={title}
                    >
                        <motion.div
                            className="absolute left-0 top-0 h-full rounded-full bg-blue-600 dark:bg-blue-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${clampedPercentage}%` }}
                            transition={{
                                duration: 1.2,
                                ease: 'easeInOut',
                            }}
                        />
                    </div>
                </div>

                {/* Footer section with progress details */}
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            {progressLabel}
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                            {progressSubLabel}
                        </p>
                    </div>
                    <p className="text-2xl font-bold">
                        {currentValue}
                        <span className="text-lg font-medium text-gray-400 dark:text-gray-500">
                            {' '}
                            / {maxValue}
                        </span>
                    </p>
                </div>
            </div>
        );
    }
);

AnimatedProgressCard.displayName = 'AnimatedProgressCard';
