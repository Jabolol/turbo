#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#ifndef __TURBO
    #define __TURBO

/**
 * @brief Struct representing a node in the routing tree.
 */
typedef struct node {
    const char *method; /**< HTTP method */
    const char *path;   /**< The path to match */
    int32_t index;      /**< JavaScript array offset location */
    struct node *left;  /**< Pointer to the left child node */
    struct node *right; /**< Pointer to the right child node */
} node_t;

/**
 * @brief Initializes and constructs a node_t tree from the given data string.
 *
 * @param data The data string containing the tree structure.
 * @return A pointer to the root node of the constructed tree, or NULL if
 * memory allocation fails.
 */
node_t *_init(char *data);

/**
 * @brief Finds a node in the tree based on the given path and method.
 *
 * @param root The root node of the tree.
 * @param method The method to search for.
 * @param path The path to search for.
 * @return The index of the found node, or 0 if not found.
 */
int32_t _find(const node_t *root, const char *method, const char *path);

/**
 * @brief Frees the memory allocated for the tree.
 *
 * @param root The root node of the tree to be freed.
 */
void _free(node_t *root);

/**
 * @brief Constructs a binary tree structure from the given root node and total
 * number of nodes.
 *
 * @param root A pointer to the first element of an array of nodes.
 * @param total The total number of nodes in the tree.
 * @return A pointer to the root node of the constructed binary tree.
 */
node_t *_tree(node_t *root, int32_t total);

#endif
