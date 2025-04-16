import Dialog from '@mui/material/Dialog';
import { createContext, memo, useContext, useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { closeDialog, dialogs$, DialogType } from './DialogFacade';

const DialogContext = createContext<DialogType | null>(null);

export function useDialogContext() {
  const dialog = useContext(DialogContext);

  if (!dialog) {
    throw new Error(
      'useDialogContext deve ser usado dentro de um DialogContext.Provider',
    );
  }

  return {
    dialog,
    close: () => closeDialog(dialog),
    dialogData: dialog.data,
  };
}

function useObservable<T>(observable$: BehaviorSubject<T>): T {
  const [value, setValue] = useState<T>(observable$.getValue());

  useEffect(() => {
    const subscription = observable$.subscribe(setValue);
    return () => subscription.unsubscribe();
  }, [observable$]);

  return value;
}

function DialogApp() {
  const dialogs = useObservable(dialogs$);

  return (
    <>
      {dialogs.map((dialog) => (
        <DialogContext.Provider key={dialog.key} value={dialog}>
          <Dialog
            onClose={() => closeDialog(dialog)}
            aria-labelledby={`dialog-title-${dialog.key}`}
            {...dialog}
          />
        </DialogContext.Provider>
      ))}
    </>
  );
}

export default memo(DialogApp);
