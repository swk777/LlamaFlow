import { FocusTrap, Group, TextInput } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import { useState } from 'react';

type Props = {
	showElement: JSX.Element;
	initialName: string;
	className?: string;
	onChange: (v: string) => void;
	style?: React.CSSProperties;
};

export default function EditableText({ showElement, initialName, onChange, className, style }: Props) {
	const [isEditingName, setIsEditingName] = useState(false);
	return (
		<Group
			gap={0}
			className={`flex-1 ${className} justify-center `}
			onClick={(e) => {
				e.stopPropagation();
			}}
			style={style}
		>
			{isEditingName ? (
				<FocusTrap active={isEditingName}>
					<TextInput
						size="xs"
						maw={144}
						defaultValue={initialName}
						className="w-full"
						onBlur={(e) => {
							setIsEditingName(false);
							onChange(e.target.value);
						}}
					></TextInput>
				</FocusTrap>
			) : (
				showElement
			)}
			{!isEditingName && (
				<IconPencil
					className="text-primary h-4 cursor-pointer shrink-0"
					onClick={() => {
						setIsEditingName(true);
					}}
				/>
			)}
		</Group>
	);
}
