import { Group, Text, useMantineTheme } from '@mantine/core';
import { IconUpload, IconFile, IconX } from '@tabler/icons';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { invoke } from '@tauri-apps/api'

export function Dropper(props: Partial<DropzoneProps>) {
    const theme = useMantineTheme();

    /**
     *  Handles the drop event.
     * @remarks
     * This function is used to handle the drop event and save the file.
     * It exists to enable debugging and a iterative call of the save_file function. 
     * 
     * @param files - An array of files to be saved.
     */
    const handle_drop = async (files: File[]) => {
        console.log("handleDrop called")
        await save_file(files);
    }

    /**
     * Saves the selected file. 
     * 
     * @remarks 
     * This function is used to create a call to the backend (rust) to
     * save a file within the allowed path.
     * 
     * @param files - An array of files to be saved.
     * @returns The filepath and file name tuple.
     */
    const save_file = async (files: File[]) => {
        try {
            console.log("Saving file: ", files); 
            const file = files[0];
            const reader = new FileReader();
        
            reader.onload = async (event) => {
                if (event.target?.result) {
                    const fileDataUpload = Array.from(new Uint8Array(event.target.result as ArrayBuffer));
                    const filePathUpload = '/usr/share/ddt/test';
                    const fileNameUpload = 'testupload';
                    console.log("saving file");
                    await invoke("save_file", { fileData: fileDataUpload, filePath: filePathUpload, fileName: fileNameUpload });
                }
            };
        
            reader.onerror = (error) => {
                console.error("Error reading file: ", error);
            };
        
            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error("Error in save_file function: ", error);
        }
    }

    return (
        <Dropzone
            onDrop={handle_drop}
            onReject={(files) => console.log('rejected files', files)}
            maxSize={3 * 1024 ** 2}
            {...props}
        >
            <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
                <Dropzone.Accept>
                    <IconUpload
                        size={50}
                        stroke={1.5}
                        color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
                    />
                </Dropzone.Accept>
                <Dropzone.Reject>
                    <IconX
                        size={50}
                        stroke={1.5}
                        color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
                    />
                </Dropzone.Reject>
                <Dropzone.Idle>
                    <IconFile
                        size={50}
                        stroke={1.5}
                    />
                </Dropzone.Idle>

                <div>
                    <Text size="xl" inline>
                        Click to select a file
                    </Text>
                </div>
            </Group>
        </Dropzone>
    );
}