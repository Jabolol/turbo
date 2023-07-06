#include "../include/turbo.h"

node_t *_init(char *data)
{
    node_t *root = NULL;
    int64_t level = 0, index = 0, cursor = 0, length = 0;
    const char *temp = ++data;

    while (*temp)
        if (*++temp == '[')
            ++length;

    if (!((root = malloc(sizeof *root * ++length))))
        return NULL;

    memset(root, 0, sizeof *root * length);

    while (*data) {
        switch (*data) {
            case '[': level++; break;
            case ']': level--; break;
            case '"': *data = '\0'; break;
            case ',': {
                if (level == 0) {
                    cursor = 0;
                    index++;
                    (root + index - 1)->index = index;
                }
                if (level == 1) {
                    *(const char **) ((char *) (root + index - 1)
                        + (sizeof(const char *) * cursor++)) = data + 2;
                }
            }
        }
        ++data;
    }
    return _tree(root, index);
}

int32_t _find(const node_t *root, const char *method, const char *path)
{
    int32_t cmp = 0;
    const node_t *current = root;
    const char *subpath = strchr(path + 8, '/');
    char *query = strchr(path + 8, '?');

    // TODO(jabolo): Implement query string parsing.
    if (query)
        *query = '\0';

    while (current) {
        cmp = strcmp(subpath, current->path);
        if (cmp < 0) {
            current = current->left;
        } else if (cmp > 0) {
            current = current->right;
        } else {
            return current->index;
        }
    }
    return 0;
}

void _free(node_t *root)
{
    free(root);
}

node_t *_tree(node_t *root, int32_t total)
{
    node_t *current = root;

    for (int32_t i = 1; (root + i)->method; i++) {
        while (1) {
            if (strcmp((root + i)->path, current->path) < 0) {
                if (current->left) {
                    current = current->left;
                } else {
                    current->left = root + i;
                    break;
                }
            } else if (strcmp((root + i)->path, current->path) > 0) {
                if (current->right) {
                    current = current->right;
                } else {
                    current->right = root + i;
                    break;
                }
            } else {
                // TODO(jabolo): Implement multiple methods for a route.
                break;
            }
        }
    }
    return root;
}
