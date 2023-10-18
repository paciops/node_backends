import createServerInstance from "./app";
import { StringValidator } from "./domain/implementation/items";
import { SafeboxArray } from "./domain/implementation/safebox-array";

let port = process.env.APP_PORT || 8000;

createServerInstance(SafeboxArray<string>, StringValidator).listen(port, () => {
    console.log(`Server started on port ${port}`);
    console.log(`Environment: ${process.env.SKELETON_ENV}`);
    console.log('Press CTRL-C to stop')
});
