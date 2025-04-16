import { Paper, PaperProps } from '@mui/material';
import { DialogProps } from '@mui/material/Dialog';
import { BehaviorSubject } from 'rxjs';

export type DialogType = DialogProps & { key: string; data?: any };

export const dialogs$ = new BehaviorSubject<DialogType[]>([]);

export function openDialog(dialog: DialogType) {
  dialog.key = dialog.key || `${Math.random().toString(36).substr(2, 9)}`;

  dialog.PaperComponent = (props: PaperProps) => (
    <Paper
      {...props}
      style={{
        position: 'absolute',
        padding: 0,
        boxShadow:
          '0px 3px 5px -1px var(--color-theme-dialog-shadow), 0px 3px 5px -1px var(--color-theme-dialog-shadow), 0px 1px 18px 0px var(--color-theme-dialog-shadow)',
      }}
      className={props.className}
    />
  );

  dialogs$.next([...dialogs$.value, dialog]);

  return () => closeDialog(dialog);
}

export function closeDialog(dialog: DialogType): void {
  dialogs$.next(dialogs$.value.filter((d) => d.key !== dialog.key));
}

export function closeAllDialogs(): void {
  dialogs$.next([]);
}
